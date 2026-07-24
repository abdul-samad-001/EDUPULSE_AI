import { useEffect, useState } from "react";
import skillService from "../../services/skillService";
import focusSessionService from "../../services/focusSessionService";

function FocusSessionCard() {
  const [skills, setSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [duration, setDuration] = useState(25);

  const [loadingSkills, setLoadingSkills] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      setLoadingSkills(true);

      const data = await skillService.getAllSkills();
      setSkills(data || []);
    } catch (error) {
      console.error("Failed to load skills:", error);
      setMessage("Failed to load skills.");
    } finally {
      setLoadingSkills(false);
    }
  };

  const handleStart = async () => {
    setMessage("");

    if (!selectedSkill) {
      setMessage("Please select a skill.");
      return;
    }

    try {
      setLoading(true);

      const response = await focusSessionService.startSession({
        skill: selectedSkill,
        plannedDurationMinutes: Number(duration),
      });

      setMessage(response.message);

      // Reset form
      setSelectedSkill("");
      setDuration(25);
    }catch (error) {
        console.error("Focus Session Error:", error);
        console.log(error.response);
        console.log(error.response?.data);
        setMessage(
            error.response?.data?.message ||
            "Failed to start focus session."
        );
    }
     finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <h2 className="text-2xl font-bold mb-5">
        🎯 Focus Session
      </h2>

      {message && (
        <div className="mb-4 rounded-lg bg-slate-100 p-3 text-sm">
          {message}
        </div>
      )}

      <div className="space-y-4">

        <div>
          <label className="block mb-2 font-medium">
            Select Skill
          </label>

          <select
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
            disabled={loadingSkills}
            className="w-full border rounded-lg p-3"
          >
            <option value="">
              {loadingSkills ? "Loading skills..." : "Choose a skill"}
            </option>

            {skills.map((skill) => (
              <option
                key={skill._id}
                value={skill._id}
              >
                {skill.skillName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Planned Duration (minutes)
          </label>

          <input
            type="number"
            min="1"
            max="240"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full border rounded-lg p-3"
          />
        </div>

        <button
          onClick={handleStart}
          disabled={loading || loadingSkills}
          className="w-full rounded-lg bg-green-600 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Starting Focus Session..." : "Start Focus Session"}
        </button>

      </div>
    </div>
  );
}

export default FocusSessionCard;