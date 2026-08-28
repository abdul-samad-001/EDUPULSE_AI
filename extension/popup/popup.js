const TELEMETRY_STORAGE_KEY = "edupulseTelemetry";
const SETTINGS_STORAGE_KEY = "edupulseSettings";

let timerInterval = null;
let currentSeconds = 0;

const syncTokenFromActiveTab = async () => {
  try {
    const tabs = await chrome.tabs.query({
      url: ["http://localhost:5173/*", "http://127.0.0.1:5173/*"],
    });

    for (const tab of tabs) {
      if (tab?.id) {
        const results = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => ({
            token: localStorage.getItem("token"),
            user: localStorage.getItem("user"),
          }),
        });

        const authData = results?.[0]?.result;
        if (authData?.token) {
          await chrome.storage.local.set({
            edupulseToken: authData.token,
            edupulseUser: authData.user ? JSON.parse(authData.user) : null,
          });
          return authData.token;
        }
      }
    }
  } catch (err) {
    // Ignore permissions or inactive tab warnings
  }
  return null;
};

const updatePopupUI = async () => {
  await syncTokenFromActiveTab();

  chrome.runtime.sendMessage({ type: "GET_STATUS" }, (response) => {
    if (chrome.runtime.lastError || !response) {
      document.getElementById("statusBadge").classList.add("disconnected");
      document.getElementById("statusText").textContent = "Disconnected";
      document.getElementById("currentDomain").textContent = "Backend Offline";
      return;
    }

    // Connection Badge
    const statusBadge = document.getElementById("statusBadge");
    const statusText = document.getElementById("statusText");
    if (response.connected) {
      statusBadge.className = "status-badge";
      statusText.textContent = "Connected";
    } else {
      statusBadge.className = "status-badge disconnected";
      statusText.textContent = response.statusLabel || "Disconnected";
    }

    // User Info & Sync
    document.getElementById("userInfo").textContent = response.user || "Student Account";
    document.getElementById("lastSyncInfo").textContent = `Last Sync: ${
      response.lastSync ? new Date(response.lastSync).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Never"
    }`;

    // Active Domain & Category
    const currentDomain = response.currentWebsite || "No Active Tab";
    const currentCategory = response.currentCategory || "neutral";
    document.getElementById("currentDomain").textContent = currentDomain;

    const categoryBadge = document.getElementById("categoryBadge");
    categoryBadge.textContent = currentCategory;
    categoryBadge.className = `category-tag category-${currentCategory}`;

    // Timer
    currentSeconds = response.currentDuration || 0;
    document.getElementById("currentTimer").textContent = formatDuration(currentSeconds);

    // Focus Status
    const focusStatus = document.getElementById("focusStatus");
    if (response.isFocusing) {
      focusStatus.textContent = "🔥 Focus Session Active";
      focusStatus.style.color = "#2dd4bf";
    } else {
      focusStatus.textContent = "🎯 Focus Mode: Standard Browsing";
      focusStatus.style.color = "#94a3b8";
    }

    // Metrics Summary
    document.getElementById("queuedSessions").textContent = response.queuedCount ?? 0;
    document.getElementById("productiveTime").textContent = `${response.productiveMins ?? 0}m`;
    document.getElementById("distractionTime").textContent = `${response.distractionMins ?? 0}m`;

    // Settings
    if (response.settings) {
      document.getElementById("toggleTracking").checked = !!response.settings.trackingEnabled;
      document.getElementById("togglePause").checked = !!response.settings.pauseTracking;
    }
  });
};

const formatDuration = (secs) => {
  if (secs < 60) return `${secs}s`;
  const mins = Math.floor(secs / 60);
  const remainingSecs = secs % 60;
  return `${mins}m ${remainingSecs}s`;
};

// Actions
document.addEventListener("DOMContentLoaded", () => {
  updatePopupUI();

  // Live timer tick
  timerInterval = setInterval(() => {
    currentSeconds++;
    document.getElementById("currentTimer").textContent = formatDuration(currentSeconds);
  }, 1000);

  // Sync Now Button
  document.getElementById("btnSync").addEventListener("click", () => {
    const syncBtn = document.getElementById("btnSync");
    syncBtn.textContent = "Syncing...";
    chrome.runtime.sendMessage({ type: "SYNC_NOW" }, () => {
      setTimeout(() => {
        syncBtn.innerHTML = "<span>🔄</span> Sync Now";
        updatePopupUI();
      }, 800);
    });
  });

  // Dashboard Button
  document.getElementById("btnDashboard").addEventListener("click", () => {
    chrome.tabs.create({ url: "http://localhost:5173/dashboard" });
  });

  // Settings Toggles
  document.getElementById("toggleTracking").addEventListener("change", (e) => {
    saveSettings({ trackingEnabled: e.target.checked });
  });

  document.getElementById("togglePause").addEventListener("change", (e) => {
    saveSettings({ pauseTracking: e.target.checked });
  });
});

const saveSettings = (updated) => {
  chrome.storage.local.get([SETTINGS_STORAGE_KEY], (res) => {
    const current = res[SETTINGS_STORAGE_KEY] || {};
    const newSettings = { ...current, ...updated };
    chrome.storage.local.set({ [SETTINGS_STORAGE_KEY]: newSettings });
  });
};