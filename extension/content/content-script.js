console.log("EduPulse content script loaded");

window.addEventListener("message", (event) => {
  console.log("Message event fired");
  console.log("Event data:", event.data);

  if (event.source !== window) {
    console.log("Wrong source");
    return;
  }

  if (event.data?.type !== "EDUPULSE_AUTH_TOKEN") {
    console.log("Wrong type:", event.data?.type);
    return;
  }

  console.log("Forwarding token...");

  chrome.runtime.sendMessage(
    {
      type: "SAVE_AUTH_TOKEN",
      token: event.data.token,
    },
    (response) => {
      console.log("Response:", response);

      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
      }
    }
  );
});