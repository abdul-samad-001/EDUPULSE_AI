const DISTRACTION_DOMAINS = [
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
  "music.youtube.com",
  "spotify.com",
  "soundcloud.com",
  "jiosaavn.com",
  "gaana.com",
  "wynk.in",
  "music.apple.com",
  "bandcamp.com",
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
  "medium.com",
  "dev.to",
  "arxiv.org",
];

const NEUTRAL_DOMAINS = [
  "google.com",
  "gmail.com",
  "calendar.google.com",
];

// YouTube Music, Entertainment & Distraction Signals (High Priority Flagging)
const YT_MUSIC_AND_ENTERTAINMENT_KEYWORDS = [
  "song",
  "songs",
  "music",
  "music video",
  "official video",
  "official audio",
  "lyric",
  "lyrics",
  "lyrical",
  "audio",
  "album",
  "remix",
  "slowed",
  "reverb",
  "bass boosted",
  "soundtrack",
  "ost",
  "ft.",
  "feat.",
  "prod by",
  "dj",
  "singer",
  "concert",
  "live performance",
  "karaoke",
  "unplugged",
  "acoustic cover",
  "orchestra",
  "synthesizer",
  "track",
  "beat",
  "rap",
  "hip hop",
  "pop song",
  "rock song",
  "punjabi song",
  "hindi song",
  "bollywood",
  "trailer",
  "teaser",
  "episode",
  "season",
  "full movie",
  "movie scene",
  "clip",
  "funny",
  "meme",
  "comedy",
  "standup",
  "vlog",
  "prank",
  "roast",
  "shorts",
  "tiktok",
  "gaming",
  "gameplay",
  "stream",
  "reaction",
  "reacting to",
  "pubg",
  "bgmi",
  "valorant",
  "gta",
  "minecraft",
  "anime",
  "cartoon",
];

// Music & Record Label Channels
const YT_MUSIC_CHANNELS = [
  "vevo",
  "t-series",
  "tseries",
  "sony music",
  "zee music",
  "tips official",
  "speed records",
  "yrf",
  "warner music",
  "universal music",
  "spinnin' records",
  "monstercat",
  "trap city",
  "trap nation",
  "billboard",
  "mtv",
  "hybe labels",
  "sm town",
  "jyp entertainment",
];

// YouTube Verified Educational Channels
const YT_EDUCATIONAL_CHANNELS = [
  "freecodecamp",
  "traversy media",
  "cs50",
  "mit opencourseware",
  "stanford",
  "harvard",
  "khan academy",
  "3blue1brown",
  "fireship",
  "web dev simplified",
  "the net ninja",
  "code with harry",
  "striver",
  "take u forward",
  "love babbar",
  "hitesh choudhary",
  "chai aur code",
  "clever programmer",
  "krish naik",
  "corey schafer",
  "statquest",
  "andrew ng",
  "lex fridman",
  "veritasium",
  "kurzgesagt",
  "numberphile",
  "computerphile",
  "simplilearn",
  "edureka",
  "edupulse",
  "edupulse ai",
];

// Strict Educational Keywords & Subjects
const YT_STRICT_EDUCATIONAL_KEYWORDS = [
  "tutorial",
  "crash course",
  "full course",
  "course",
  "lecture",
  "dsa",
  "data structure",
  "algorithm",
  "algorithms",
  "how to code",
  "how to build",
  "coding interview",
  "leetcode",
  "system design",
  "web development",
  "full stack development",
  "machine learning",
  "deep learning",
  "artificial intelligence",
  "data science",
  "exam preparation",
  "gate exam",
  "jee exam",
  "upsc",
  "linear algebra",
  "calculus",
  "for beginners",
  "masterclass",
  "documentation walkthrough",
  "architecture breakdown",
];

export const normalizeDomain = (domain) => {
  if (!domain) return "";
  return domain.toLowerCase().replace(/^www\./, "");
};

export const matchesDomain = (domain, domainList) => {
  return domainList.some(
    (listedDomain) =>
      domain === listedDomain || domain.endsWith(`.${listedDomain}`)
  );
};

/**
 * Classify a specific YouTube video based on Title, Channel, and URL
 */
export const classifyYouTubeVideo = (title = "", channel = "", url = "") => {
  const lowerUrl = (url || "").toLowerCase();
  const lowerTitle = (title || "").toLowerCase();
  const lowerChannel = (channel || "").toLowerCase();

  // 1. YouTube Shorts are always distractions
  if (lowerUrl.includes("/shorts/")) {
    return "distraction";
  }

  // 2. IMMEDIATE MUSIC & ENTERTAINMENT CHECK
  // If the channel is a music label or title contains song/music/audio/video keywords, mark as distraction
  const isMusicChannel = YT_MUSIC_CHANNELS.some((c) => lowerChannel.includes(c));
  if (isMusicChannel) {
    return "distraction";
  }

  const hasMusicOrEntertainmentSignal = YT_MUSIC_AND_ENTERTAINMENT_KEYWORDS.some((kw) => {
    // Exact word boundary or contained keyword
    return lowerTitle.includes(kw);
  });

  if (hasMusicOrEntertainmentSignal) {
    // Double-check: ensure it's not a rare tutorial titled "Learn Python: build a music app"
    const isExplicitProgrammingTutorial =
      lowerTitle.includes("tutorial") ||
      lowerTitle.includes("full course") ||
      lowerTitle.includes("crash course") ||
      lowerTitle.includes("how to build");

    if (!isExplicitProgrammingTutorial) {
      return "distraction";
    }
  }

  // 3. Verified Educational Channels (Safe from music false-positives)
  if (
    lowerChannel &&
    YT_EDUCATIONAL_CHANNELS.some((c) => lowerChannel.includes(c))
  ) {
    return "productive";
  }

  // 4. Strict Educational Title Match
  const hasStrictEducationalKeyword = YT_STRICT_EDUCATIONAL_KEYWORDS.some((kw) =>
    lowerTitle.includes(kw)
  );

  if (hasStrictEducationalKeyword) {
    return "productive";
  }

  // 5. Default: If browsing watch page without explicit educational proof, count as distraction
  if (lowerUrl.includes("/watch")) {
    return "distraction";
  }

  return "neutral";
};

/**
 * Universal domain classifier with YouTube context support
 */
export const classifyDomain = (domain, url = "", title = "", channel = "") => {
  const normalizedDomain = normalizeDomain(domain);

  // Special handling for YouTube
  if (normalizedDomain === "youtube.com" || normalizedDomain.endsWith(".youtube.com")) {
    return classifyYouTubeVideo(title, channel, url);
  }

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
    if (!url) return null;
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