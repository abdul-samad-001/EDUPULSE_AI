console.log("EduPulse content script initialized");

const syncTokenFromLocalStorage = () => {
  try {
    const token = localStorage.getItem("token");
    if (token && typeof token === "string" && chrome?.runtime?.id) {
      chrome.runtime.sendMessage({
        type: "SAVE_AUTH_TOKEN",
        token: token,
      });
    }
  } catch (e) {
    // ignore
  }
};

if (document.readyState === "complete" || document.readyState === "interactive") {
  syncTokenFromLocalStorage();
} else {
  window.addEventListener("DOMContentLoaded", syncTokenFromLocalStorage);
}

window.addEventListener("message", (event) => {
  if (
    event.source !== window ||
    !event.data ||
    typeof event.data !== "object" ||
    typeof event.data.type !== "string" ||
    !event.data.type.startsWith("EDUPULSE_")
  ) {
    return;
  }

  if (event.data.type === "EDUPULSE_AUTH_TOKEN" && event.data.token) {
    try {
      if (chrome?.runtime?.id) {
        chrome.runtime.sendMessage({
          type: "SAVE_AUTH_TOKEN",
          token: event.data.token,
        });
      }
    } catch (err) {
      // ignore
    }
  }

  if (event.data.type === "EDUPULSE_FOCUS_MODE") {
    try {
      if (chrome?.runtime?.id) {
        chrome.runtime.sendMessage({
          type: "SET_FOCUS_MODE",
          isFocusing: !!event.data.isFocusing,
        });
      }
    } catch (err) {
      // ignore
    }
  }
});