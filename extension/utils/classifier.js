const DISTRACTION_DOMAINS = [
  "youtube.com",
  "instagram.com",
  "facebook.com",
  "twitter.com",
  "x.com",
  "tiktok.com",
  "netflix.com",
  "primevideo.com",
  "hotstar.com",
  "twitch.tv",
  "snapchat.com",
  "pinterest.com",
  "reddit.com",
];

const PRODUCTIVE_DOMAINS = [
  "github.com",
  "stackoverflow.com",
  "leetcode.com",
  "hackerrank.com",
  "developer.mozilla.org",
  "chatgpt.com",
  "openai.com",
  "geeksforgeeks.org",
  "w3schools.com",
  "coursera.org",
  "udemy.com",
  "kaggle.com",
  "fastapi.tiangolo.com",
  "react.dev",
  "nodejs.org",
  "expressjs.com",
  "mongodb.com",
  "tailwindcss.com",
  "vitejs.dev",
];

const NEUTRAL_DOMAINS = [
  "google.com",
  "gmail.com",
  "calendar.google.com",
];

const normalizeDomain = (domain) => {
  if (!domain) {
    return "";
  }

  return domain
    .toLowerCase()
    .replace(/^www\./, "");
};

const matchesDomain = (domain, domainList) => {
  return domainList.some(
    (listedDomain) =>
      domain === listedDomain ||
      domain.endsWith(`.${listedDomain}`)
  );
};

export const classifyDomain = (domain) => {
  const normalizedDomain = normalizeDomain(domain);

  if (matchesDomain(normalizedDomain, DISTRACTION_DOMAINS)) {
    return "distraction";
  }

  if (matchesDomain(normalizedDomain, PRODUCTIVE_DOMAINS)) {
    return "productive";
  }

  if (matchesDomain(normalizedDomain, NEUTRAL_DOMAINS)) {
    return "neutral";
  }

  return "neutral";
};

export const getDomainFromUrl = (url) => {
  try {
    if (!url) {
      return null;
    }

    const parsedUrl = new URL(url);

    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      return null;
    }

    return normalizeDomain(parsedUrl.hostname);
  } catch (error) {
    console.error("EduPulse domain parsing error:", error);
    return null;
  }
};