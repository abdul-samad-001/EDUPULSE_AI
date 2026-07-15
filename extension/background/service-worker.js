import {
  classifyDomain,
  getDomainFromUrl,
} from "../utils/classifier.js";

const TELEMETRY_STORAGE_KEY = "edupulseTelemetry";

const BATCH_ALARM_NAME = "edupulseTelemetryBatch";

const BATCH_INTERVAL_MINUTES = 5;

const IDLE_THRESHOLD_SECONDS = 60;


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


// ==========================================================
// FIVE-MINUTE BATCH CHECKPOINT
// ==========================================================

chrome.alarms.onAlarm.addListener(
  async (alarm) => {
    if (
      alarm.name !== BATCH_ALARM_NAME
    ) {
      return;
    }

    console.log(
      "EduPulse 5-minute telemetry checkpoint"
    );

    await endActiveSession();

    const result =
      await chrome.storage.local.get(
        TELEMETRY_STORAGE_KEY
      );

    const telemetry =
      result[TELEMETRY_STORAGE_KEY] || [];

    console.log(
      "Current telemetry batch:",
      telemetry
    );

    await startActiveTabSession();
  }
);