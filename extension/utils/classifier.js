const DISTRACTION_DOMAINS = [
  "youtube.com",
  "instagram.com",
  "facebook.com",
  "twitter.com",
  "x.com",
  "reddit.com",
  "netflix.com",
  "primevideo.com",
  "hotstar.com",
  "twitch.tv",
  "snapchat.com",
  "pinterest.com",
];

const PRODUCTIVE_DOMAINS = [
  "github.com",
  "stackoverflow.com",
  "leetcode.com",
  "geeksforgeeks.org",
  "w3schools.com",
  "developer.mozilla.org",
  "docs.google.com",
  "coursera.org",
  "udemy.com",
  "kaggle.com",
  "chatgpt.com",
  "openai.com",
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

  if (
    matchesDomain(
      normalizedDomain,
      DISTRACTION_DOMAINS
    )
  ) {
    return "distraction";
  }

  if (
    matchesDomain(
      normalizedDomain,
      PRODUCTIVE_DOMAINS
    )
  ) {
    return "productive";
  }

  return "neutral";
};

export const getDomainFromUrl = (url) => {
  try {
    if (!url) {
      return null;
    }

    const parsedUrl = new URL(url);

    if (
      parsedUrl.protocol !== "http:" &&
      parsedUrl.protocol !== "https:"
    ) {
      return null;
    }

    return normalizeDomain(parsedUrl.hostname);
  } catch (error) {
    console.error(
      "EduPulse domain parsing error:",
      error
    );

    return null;
  }
};