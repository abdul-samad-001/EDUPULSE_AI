import {
  classifyDomain,
  getDomainFromUrl,
} from "../utils/classifier.js";

const TELEMETRY_STORAGE_KEY = "edupulseTelemetry";
const SETTINGS_STORAGE_KEY = "edupulseSettings";
const BATCH_ALARM_NAME = "edupulseTelemetryBatch";
const BATCH_INTERVAL_MINUTES = 5;
const IDLE_THRESHOLD_SECONDS = 60;

const API_BASE_URL = "http://localhost:5000/api";
const TELEMETRY_ENDPOINT = `${API_BASE_URL}/telemetry/sessions`;

let activeSession = null;
let userState = "active";
let isFocusing = false;

// Default Settings
const DEFAULT_SETTINGS = {
  trackingEnabled: true,
  pauseTracking: false,
  autoSync: true,
  notifications: true,
};

// ==========================================================
// INITIALIZATION
// ==========================================================

chrome.runtime.onInstalled.addListener(async () => {
  console.log("EduPulse AI Focus Companion installed");

  const existingSettings = await chrome.storage.local.get(SETTINGS_STORAGE_KEY);
  if (!existingSettings[SETTINGS_STORAGE_KEY]) {
    await chrome.storage.local.set({ [SETTINGS_STORAGE_KEY]: DEFAULT_SETTINGS });
  }

  const existingTelem = await chrome.storage.local.get(TELEMETRY_STORAGE_KEY);
  if (!existingTelem[TELEMETRY_STORAGE_KEY]) {
    await chrome.storage.local.set({ [TELEMETRY_STORAGE_KEY]: [] });
  }

  await createBatchAlarm();
  chrome.idle.setDetectionInterval(IDLE_THRESHOLD_SECONDS);
  await startActiveTabSession();
});

chrome.runtime.onStartup.addListener(async () => {
  console.log("EduPulse AI Focus Companion started");
  await createBatchAlarm();
  chrome.idle.setDetectionInterval(IDLE_THRESHOLD_SECONDS);
  await startActiveTabSession();
});

const createBatchAlarm = async () => {
  await chrome.alarms.clear(BATCH_ALARM_NAME);
  chrome.alarms.create(BATCH_ALARM_NAME, {
    periodInMinutes: BATCH_INTERVAL_MINUTES,
  });
};

// ==========================================================
// STORAGE & TELEMETRY PIPELINE
// ==========================================================

const saveTelemetrySession = async (session) => {
  if (!session || !session.domain || session.durationSeconds <= 0) return;

  const { edupulseSettings } = await chrome.storage.local.get(SETTINGS_STORAGE_KEY);
  const settings = edupulseSettings || DEFAULT_SETTINGS;

  if (!settings.trackingEnabled || settings.pauseTracking) return;

  const result = await chrome.storage.local.get(TELEMETRY_STORAGE_KEY);
  const telemetry = result[TELEMETRY_STORAGE_KEY] || [];

  // De-duplication check
  const isDuplicate = telemetry.some(
    (t) => t.domain === session.domain && t.startedAt === session.startedAt
  );

  if (!isDuplicate) {
    session.focusSession = isFocusing;
    telemetry.push(session);
    await chrome.storage.local.set({ [TELEMETRY_STORAGE_KEY]: telemetry });
    console.log("EduPulse telemetry session stored:", session);
  }
};

const uploadTelemetry = async () => {
  try {
    const telemetryResult = await chrome.storage.local.get(TELEMETRY_STORAGE_KEY);
    const telemetry = telemetryResult[TELEMETRY_STORAGE_KEY] || [];

    if (telemetry.length === 0) return;

    const { edupulseToken: token } = await chrome.storage.local.get("edupulseToken");

    if (!token) {
      console.log("No auth token present. Telemetry queued offline.");
      return;
    }

    const response = await fetch(TELEMETRY_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ sessions: telemetry }),
    });

    if (response.ok) {
      console.log("EduPulse telemetry batch uploaded successfully.");
      await chrome.storage.local.set({
        [TELEMETRY_STORAGE_KEY]: [],
        lastSyncTimestamp: new Date().toISOString(),
      });
    } else {
      console.warn("Upload failed with status:", response.status, ". Kept in offline queue.");
    }
  } catch (error) {
    console.error("Telemetry upload network error:", error);
  }
};

// ==========================================================
// SESSION TRACKING
// ==========================================================

const endActiveSession = async () => {
  if (!activeSession) return;

  const endedAt = Date.now();
  const durationSeconds = Math.floor((endedAt - activeSession.startedAt) / 1000);

  if (durationSeconds >= 2) {
    const completedSession = {
      domain: activeSession.domain,
      category: activeSession.category,
      title: activeSession.title || activeSession.domain,
      url: activeSession.url || "",
      startedAt: new Date(activeSession.startedAt).toISOString(),
      endedAt: new Date(endedAt).toISOString(),
      durationSeconds,
      focusSession: isFocusing,
    };

    await saveTelemetrySession(completedSession);
  }

  activeSession = null;
};

const startSessionForTab = async (tab) => {
  if (userState !== "active") return;

  const domain = getDomainFromUrl(tab?.url);
  if (!domain) {
    activeSession = null;
    return;
  }

  const category = classifyDomain(domain, tab.url || "", tab.title || "");

  activeSession = {
    tabId: tab.id,
    domain,
    title: tab.title || domain,
    url: tab.url || "",
    category,
    startedAt: Date.now(),
  };

  console.log(`EduPulse session started: ${activeSession.domain} [${category}]`);
};

const startActiveTabSession = async () => {
  if (userState !== "active") return;

  const tabs = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });

  const activeTab = tabs[0];
  if (activeTab) {
    await startSessionForTab(activeTab);
  }
};

const switchActiveSession = async (tab) => {
  await endActiveSession();
  await startSessionForTab(tab);
};

// ==========================================================
// TAB & WINDOW LISTENERS
// ==========================================================

chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  try {
    const tab = await chrome.tabs.get(tabId);
    await switchActiveSession(tab);
  } catch (error) {
    console.error("Tab activation error:", error);
  }
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete" || !tab.active) return;
  if (activeSession?.tabId === tabId && activeSession?.domain === getDomainFromUrl(tab.url)) {
    // Re-check classification on title or URL update (e.g. YouTube video navigation)
    const updatedCategory = classifyDomain("youtube.com", tab.url, tab.title);
    if (activeSession.category !== updatedCategory) {
      await switchActiveSession(tab);
    }
    return;
  }

  await switchActiveSession(tab);
});

chrome.windows.onFocusChanged.addListener(async (windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    return;
  }

  try {
    const win = await chrome.windows.get(windowId);
    if (win.type === "normal") {
      const tabs = await chrome.tabs.query({ active: true, windowId });
      if (tabs[0] && activeSession?.tabId !== tabs[0].id) {
        await switchActiveSession(tabs[0]);
      }
    }
  } catch (e) {
    // ignore
  }
});

chrome.idle.onStateChanged.addListener(async (newState) => {
  userState = newState;
  if (newState !== "active") {
    await endActiveSession();
    return;
  }
  await startActiveTabSession();
});

// ==========================================================
// MESSAGE HANDLER
// ==========================================================

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message) return false;

  if (message.type === "YOUTUBE_VIDEO_METADATA") {
    const newCategory = classifyDomain("youtube.com", message.url, message.title, message.channel);
    if (activeSession && (activeSession.domain === "youtube.com" || activeSession.domain.endsWith(".youtube.com"))) {
      if (activeSession.category !== newCategory) {
        endActiveSession().then(() => {
          activeSession = {
            tabId: sender?.tab?.id || activeSession?.tabId,
            domain: "youtube.com",
            title: message.title || "YouTube Video",
            url: message.url || "",
            category: newCategory,
            startedAt: Date.now(),
          };
          console.log(`EduPulse YouTube video reclassified: [${newCategory}] -> ${message.title}`);
        });
      } else {
        activeSession.title = message.title || activeSession.title;
        activeSession.url = message.url || activeSession.url;
      }
    }
    return false;
  }

  if (message.type === "SAVE_AUTH_TOKEN") {
    if (message.token) {
      chrome.storage.local.set({ edupulseToken: message.token }, () => {
        console.log("Token saved to extension storage.");
      });
    }
    return false; // Fire-and-forget, no response port kept open
  }

  if (message.type === "SET_FOCUS_MODE") {
    isFocusing = !!message.isFocusing;
    chrome.storage.local.set({ isFocusing });
    return false; // Fire-and-forget, no response port kept open
  }

  if (message.type === "SYNC_NOW") {
    endActiveSession().then(() => {
      uploadTelemetry().then(() => {
        startActiveTabSession();
        try { sendResponse({ success: true }); } catch { /* ignore */ }
      });
    });
    return true;
  }

  if (message.type === "GET_STATUS") {
    chrome.storage.local.get(
      ["edupulseToken", "edupulseSettings", "lastSyncTimestamp", TELEMETRY_STORAGE_KEY],
      async (res) => {
        let backendAlive = false;
        try {
          const ping = await fetch("http://localhost:5000/api/telemetry/test", { method: "GET" });
          if (ping.ok) backendAlive = true;
        } catch (e) {
          backendAlive = false;
        }

        const hasToken = !!res.edupulseToken;
        const isConnected = backendAlive && hasToken;

        let domain = activeSession?.domain;
        let category = activeSession?.category || "neutral";
        let duration = activeSession
          ? Math.floor((Date.now() - activeSession.startedAt) / 1000)
          : 0;

        if (!domain) {
          try {
            const tabs = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
            if (tabs[0]?.url) {
              domain = getDomainFromUrl(tabs[0].url);
              if (domain) category = classifyDomain(domain);
            }
          } catch (e) {
            // ignore
          }
        }

        let displayDomain = domain || "Active Browsing";
        let statusLabel = "Connected";

        if (!backendAlive) {
          statusLabel = "Backend Offline";
          displayDomain = "Backend Server Down";
        } else if (!hasToken) {
          statusLabel = "Login Required";
        }

        // Combine offline queue + active session + backend summary
        const localSessions = res[TELEMETRY_STORAGE_KEY] || [];
        let localProdSecs = 0;
        let localDistSecs = 0;

        for (const s of localSessions) {
          if (s.category === "productive") localProdSecs += Number(s.durationSeconds || 0);
          if (s.category === "distraction") localDistSecs += Number(s.durationSeconds || 0);
        }

        if (activeSession) {
          if (activeSession.category === "productive") localProdSecs += duration;
          if (activeSession.category === "distraction") localDistSecs += duration;
        }

        let apiProdMins = 0;
        let apiDistMins = 0;

        if (isConnected) {
          try {
            const summaryReq = await fetch(`${API_BASE_URL}/telemetry/summary`, {
              headers: { Authorization: `Bearer ${res.edupulseToken}` },
            });
            if (summaryReq.ok) {
              const summaryJson = await summaryReq.json();
              if (summaryJson.data) {
                apiProdMins = Number(summaryJson.data.productiveTime || 0);
                apiDistMins = Number(summaryJson.data.distractionTime || 0);
              }
            }
          } catch (e) {
            // ignore
          }
        }

        const productiveMins = apiProdMins + Math.floor(localProdSecs / 60);
        const distractionMins = apiDistMins + Math.floor(localDistSecs / 60);

        try {
          sendResponse({
            connected: isConnected,
            statusLabel,
            backendAlive,
            hasToken,
            user: isConnected
              ? "Active Student"
              : hasToken
              ? "Student Account"
              : "Please Log In",
            lastSync: res.lastSyncTimestamp || "Never",
            currentWebsite: displayDomain,
            currentCategory: category,
            currentDuration: duration,
            isFocusing: !!isFocusing,
            queuedCount: localSessions.length,
            productiveMins,
            distractionMins,
            settings: res.edupulseSettings || DEFAULT_SETTINGS,
          });
        } catch (err) {
          console.error("GET_STATUS sendResponse error:", err);
        }
      }
    );
    return true;
  }

  return false;
});

// ==========================================================
// ALARM LISTENER
// ==========================================================

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== BATCH_ALARM_NAME) return;

  await endActiveSession();
  await uploadTelemetry();
  await startActiveTabSession();
});
