/**
 * EduPulse AI - YouTube Smart Video Telemetry Content Script
 */

let lastUrl = "";
let lastTitle = "";

const extractYouTubeMetadata = () => {
  const currentUrl = window.location.href;

  // Extract title
  let title = "";
  const titleEl =
    document.querySelector("h1.ytd-watch-metadata yt-formatted-string") ||
    document.querySelector("#title h1 yt-formatted-string") ||
    document.querySelector("h1.title") ||
    document.querySelector("title");

  if (titleEl) {
    title = titleEl.innerText || titleEl.textContent || "";
  }

  if (!title && document.title) {
    title = document.title.replace(/\s*-\s*YouTube$/i, "");
  }

  // Extract channel
  let channel = "";
  const channelEl =
    document.querySelector("ytd-channel-name a") ||
    document.querySelector("#channel-name a") ||
    document.querySelector("#owner-name a") ||
    document.querySelector("ytd-video-owner-renderer a");

  if (channelEl) {
    channel = channelEl.innerText || channelEl.textContent || "";
  }

  return {
    url: currentUrl,
    title: title.trim(),
    channel: channel.trim(),
  };
};

const notifyBackground = () => {
  const meta = extractYouTubeMetadata();

  if (!meta.title && !meta.url.includes("/watch") && !meta.url.includes("/shorts")) {
    return;
  }

  if (meta.url === lastUrl && meta.title === lastTitle) {
    return;
  }

  lastUrl = meta.url;
  lastTitle = meta.title;

  try {
    if (chrome?.runtime?.id) {
      chrome.runtime.sendMessage({
        type: "YOUTUBE_VIDEO_METADATA",
        url: meta.url,
        title: meta.title,
        channel: meta.channel,
      });
    }
  } catch (err) {
    // Port closed or extension updated
  }
};

// Listen to YouTube SPA navigation events
window.addEventListener("yt-navigate-finish", () => {
  setTimeout(notifyBackground, 600);
  setTimeout(notifyBackground, 1800);
});

window.addEventListener("yt-page-data-updated", () => {
  setTimeout(notifyBackground, 500);
});

// Periodic observer for initial load or title change
const observer = new MutationObserver(() => {
  if (window.location.href !== lastUrl || document.title !== lastTitle) {
    notifyBackground();
  }
});

observer.observe(document, {
  subtree: true,
  childList: true,
  characterData: true,
});

// Initial run
if (document.readyState === "complete" || document.readyState === "interactive") {
  setTimeout(notifyBackground, 800);
} else {
  window.addEventListener("DOMContentLoaded", () => {
    setTimeout(notifyBackground, 800);
  });
}
