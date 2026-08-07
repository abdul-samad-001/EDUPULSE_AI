console.log("EduPulse content script loaded");

window.addEventListener("message", (event) => {
  if (event.source !== window) return;
  if (!event.data || event.data.type !== "EDUPULSE_AUTH_TOKEN") return;

  console.log("EduPulse auth token detected. Forwarding to background worker...");

  try {
    if (chrome?.runtime?.sendMessage) {
      chrome.runtime.sendMessage(
        {
          type: "SAVE_AUTH_TOKEN",
          token: event.data.token,
        },
        (response) => {
          if (chrome.runtime.lastError) {
            console.warn("EduPulse Extension token sync note:", chrome.runtime.lastError.message);
          } else {
            console.log("EduPulse extension token saved successfully:", response);
          }
        }
      );
    }
  } catch (err) {
    console.warn("EduPulse Extension message dispatch error:", err);
  }
});