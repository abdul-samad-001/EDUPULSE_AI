import {
  classifyDomain,
  getDomainFromUrl,
} from "../utils/classifier.js";

const TELEMETRY_STORAGE_KEY = "edupulseTelemetry";

const BATCH_ALARM_NAME = "edupulseTelemetryBatch";

const BATCH_INTERVAL_MINUTES = 5;

const IDLE_THRESHOLD_SECONDS = 60;
const API_BASE_URL = "http://localhost:5000/api";

const TELEMETRY_ENDPOINT =
  `${API_BASE_URL}/telemetry/sessions`;

let activeSession = null;

let userState = "active";


// ==========================================================
// INITIALIZE EXTENSION
// ==========================================================

chrome.runtime.onInstalled.addListener(async () => {
  console.log(
    "EduPulse AI Focus Tracker installed"
  );

  await chrome.storage.local.set({
    [TELEMETRY_STORAGE_KEY]: [],
  });

  await createBatchAlarm();

  chrome.idle.setDetectionInterval(
    IDLE_THRESHOLD_SECONDS
  );

  await startActiveTabSession();
});


chrome.runtime.onStartup.addListener(async () => {
  console.log(
    "EduPulse AI Focus Tracker started"
  );

  await createBatchAlarm();

  chrome.idle.setDetectionInterval(
    IDLE_THRESHOLD_SECONDS
  );

  await startActiveTabSession();
});


// ==========================================================
// ALARM CONFIGURATION
// ==========================================================

const createBatchAlarm = async () => {
  await chrome.alarms.clear(
    BATCH_ALARM_NAME
  );

  chrome.alarms.create(
    BATCH_ALARM_NAME,
    {
      periodInMinutes:
        BATCH_INTERVAL_MINUTES,
    }
  );
};


// ==========================================================
// STORAGE
// ==========================================================

const saveTelemetrySession = async (session) => {
  if (!session) {
    return;
  }

  if (session.durationSeconds <= 0) {
    return;
  }

  const result =
    await chrome.storage.local.get(
      TELEMETRY_STORAGE_KEY
    );

  const telemetry =
    result[TELEMETRY_STORAGE_KEY] || [];

  telemetry.push(session);

  await chrome.storage.local.set({
    [TELEMETRY_STORAGE_KEY]: telemetry,
  });

  console.log(
    "EduPulse telemetry stored:",
    session
  );
};

const uploadTelemetry = async () => {
  console.log("===== uploadTelemetry CALLED =====");

  try {
    // Get stored telemetry
    const telemetryResult = await chrome.storage.local.get(
      TELEMETRY_STORAGE_KEY
    );

    const telemetry =
      telemetryResult[TELEMETRY_STORAGE_KEY] || [];

    if (telemetry.length === 0) {
      console.log("No telemetry to upload.");
      return;
    }

    // Get JWT token
    const tokenResult = await chrome.storage.local.get("edupulseToken");
    const token = tokenResult.edupulseToken;

    if (!token) {
      console.error("No JWT token found in extension storage.");
      return;
    }

    console.log("Uploading", telemetry.length, "sessions...");

    const response = await fetch(TELEMETRY_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        sessions: telemetry,
      }),
    });

    const responseText = await response.text();

    console.log("Status:", response.status);
    console.log("Response:", responseText);

    if (!response.ok) {
      throw new Error(
        `Upload failed (${response.status}): ${responseText}`
      );
    }

    console.log("Telemetry uploaded successfully.");

    // Clear uploaded telemetry
    await chrome.storage.local.set({
      [TELEMETRY_STORAGE_KEY]: [],
    });

    console.log("Local telemetry cleared.");
  } catch (error) {
    console.error("Telemetry upload error:", error);
  }
};
// ==========================================================
// SESSION TRACKING
// ==========================================================

const endActiveSession = async () => {
  if (!activeSession) {
    return;
  }

  const endedAt = Date.now();

  const durationSeconds = Math.floor(
    (endedAt - activeSession.startedAt) /
      1000
  );

  const completedSession = {
    domain: activeSession.domain,

    category: activeSession.category,

    startedAt: new Date(
      activeSession.startedAt
    ).toISOString(),

    endedAt: new Date(
      endedAt
    ).toISOString(),

    durationSeconds,
  };

  activeSession = null;

  await saveTelemetrySession(
    completedSession
  );
};


const startSessionForTab = async (tab) => {
  if (userState !== "active") {
    return;
  }

  const domain = getDomainFromUrl(
    tab?.url
  );

  if (!domain) {
    activeSession = null;

    return;
  }

  activeSession = {
    tabId: tab.id,

    domain,

    category: classifyDomain(domain),

    startedAt: Date.now(),
  };

  console.log(
    "EduPulse session started:",
    activeSession
  );
};


const startActiveTabSession = async () => {
  if (userState !== "active") {
    return;
  }

  const tabs = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });

  const activeTab = tabs[0];

  if (!activeTab) {
    return;
  }

  await startSessionForTab(activeTab);
};


const switchActiveSession = async (tab) => {
  await endActiveSession();

  await startSessionForTab(tab);
};


// ==========================================================
// TAB EVENTS
// ==========================================================

chrome.tabs.onActivated.addListener(
  async ({ tabId }) => {
    try {
      const tab = await chrome.tabs.get(
        tabId
      );

      await switchActiveSession(tab);
    } catch (error) {
      console.error(
        "EduPulse tab activation error:",
        error
      );
    }
  }
);


chrome.tabs.onUpdated.addListener(
  async (tabId, changeInfo, tab) => {
    if (
      changeInfo.status !== "complete"
    ) {
      return;
    }

    if (!tab.active) {
      return;
    }

    if (
      activeSession?.tabId === tabId &&
      activeSession?.domain ===
        getDomainFromUrl(tab.url)
    ) {
      return;
    }

    await switchActiveSession(tab);
  }
);


// ==========================================================
// WINDOW FOCUS
// ==========================================================

chrome.windows.onFocusChanged.addListener(
  async (windowId) => {
    if (
      windowId ===
      chrome.windows.WINDOW_ID_NONE
    ) {
      await endActiveSession();

      return;
    }

    await endActiveSession();

    await startActiveTabSession();
  }
);


// ==========================================================
// USER IDLE DETECTION
// ==========================================================

chrome.idle.onStateChanged.addListener(
  async (newState) => {
    userState = newState;

    console.log(
      "EduPulse user state:",
      newState
    );

    if (newState !== "active") {
      await endActiveSession();

      return;
    }

    await startActiveTabSession();
  }
);
// =====================================================
// External Message Listener
// Runs immediately when the service worker starts
// =====================================================

chrome.runtime.onMessageExternal.addListener(
  (message, sender, sendResponse) => {
    console.log("External message received:", message);

    if (message.type === "SAVE_AUTH_TOKEN") {
      chrome.storage.local.set(
        {
          edupulseToken: message.token,
        },
        () => {
          console.log("JWT saved successfully!");

          sendResponse({
            success: true,
          });
        }
      );

      return true;
    }
  }
);

// =====================================================
// Alarm Listener
// =====================================================

chrome.alarms.onAlarm.addListener(async (alarm) => {
  console.log("Alarm Fired:", alarm.name);

  if (alarm.name !== BATCH_ALARM_NAME) {
    return;
  }

  console.log("EduPulse 5-minute telemetry checkpoint");

  await endActiveSession();

  const result = await chrome.storage.local.get(
    TELEMETRY_STORAGE_KEY
  );

  const telemetry =
    result[TELEMETRY_STORAGE_KEY] || [];

  console.log(
    "Current telemetry batch:",
    telemetry
  );

  await uploadTelemetry();

  await startActiveTabSession();
});

