// backend/src/services/geminiService.js
// NEW FILE — no existing file with this name, so zero conflict risk.
// Single responsibility: call Gemini, return a clean parsed array of tasks.

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generates a structured learning roadmap for a given skill using Gemini.
 *
 * @param {string} skillName - e.g. "Graph Algorithms"
 * @param {string} category - e.g. "DSA" (falls back to "General" — matches Skill.js default)
 * @returns {Promise<Array<{taskName: string, difficulty: string}>>}
 * @throws Error if Gemini is unreachable or returns unparsable output —
 *         caller (controller) is responsible for catching and responding.
 */
const generateRoadmapTasks = async (skillName, category = "General") => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `Create a structured technical learning roadmap for the skill: "${skillName}" under the domain "${category}".
Divide the roadmap into a sequence of DAYS (typically 5 to 8 days), where each day represents one focused chunk of learning. Each day should contain 1 to 3 concrete, checkable milestone tasks, ordered from basic setup to advanced application across the full sequence.
Return ONLY a raw JSON array, with no markdown formatting, no code fences, and no explanation text before or after. Match this exact schema:
[{"taskName": "string describing one learning step", "difficulty": "Easy" | "Medium" | "Hard", "assignedDay": 1}]
The "assignedDay" field must be a sequential integer starting at 1. Group related tasks under the same day. Do not skip day numbers.`;

  const result = await model.generateContent(prompt);
  const rawText = result.response.text();

  // Gemini sometimes wraps JSON in ```json ... ``` even when told not to.
  const cleaned = rawText
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  let parsedTasks;
  try {
    parsedTasks = JSON.parse(cleaned);
  } catch (parseError) {
    throw new Error(
      "Gemini returned an unparsable response. Please try generating the roadmap again."
    );
  }

  if (!Array.isArray(parsedTasks) || parsedTasks.length === 0) {
    throw new Error("Gemini returned an empty or invalid roadmap.");
  }

  const validDifficulties = ["Easy", "Medium", "Hard"];
  const sanitized = parsedTasks
    .filter((t) => t && typeof t.taskName === "string" && t.taskName.trim())
    .slice(0, 12)
    .map((t) => ({
      taskName: t.taskName.trim(),
      difficulty: validDifficulties.includes(t.difficulty)
        ? t.difficulty
        : "Easy",
      assignedDay:
        Number.isInteger(t.assignedDay) && t.assignedDay > 0
          ? t.assignedDay
          : 1,
    }));
  if (sanitized.length === 0) {
    throw new Error("Gemini response had no valid tasks after sanitization.");
  }

  return sanitized;
};

module.exports = { generateRoadmapTasks };
