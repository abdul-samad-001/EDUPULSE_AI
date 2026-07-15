const TELEMETRY_STORAGE_KEY =
  "edupulseTelemetry";


const loadTelemetryStats = async () => {
  const result =
    await chrome.storage.local.get(
      TELEMETRY_STORAGE_KEY
    );

  const telemetry =
    result[TELEMETRY_STORAGE_KEY] || [];

  const distractionSessions =
    telemetry.filter(
      (session) =>
        session.category ===
        "distraction"
    );

  const distractionSeconds =
    distractionSessions.reduce(
      (total, session) =>
        total +
        Number(
          session.durationSeconds || 0
        ),
      0
    );

  const distractionMinutes = Math.floor(
    distractionSeconds / 60
  );

  document.getElementById(
    "sessionCount"
  ).textContent = telemetry.length;

  document.getElementById(
    "distractionTime"
  ).textContent =
    `${distractionMinutes} min`;

  document.getElementById(
    "distractionVisits"
  ).textContent =
    distractionSessions.length;
};


document.addEventListener(
  "DOMContentLoaded",
  loadTelemetryStats
);