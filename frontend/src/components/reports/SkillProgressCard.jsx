function SkillProgressCard({ skills }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold mb-5">
        📚 Skill Progress
      </h2>

      {skills.length === 0 ? (
        <p className="text-slate-500">
          No skills found.
        </p>
      ) : (
        <div className="space-y-5">
          {skills.map((skill) => (
            <div key={skill._id}>
              <div className="flex justify-between mb-1">
                <span className="font-medium">
                  {skill.skillName}
                </span>

                <span className="text-slate-600">
                  {skill.progress}%
                </span>
              </div>

              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{
                    width: `${skill.progress}%`,
                  }}
                />
              </div>

              <div className="text-sm text-gray-500 mt-2 flex gap-5">
                <span>
                  Category: {skill.category}
                </span>

                <span>
                  Day: {skill.currentDay}
                </span>

                <span>
                  🔥 {skill.streakCount}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SkillProgressCard;