function RecentSkills({ skills }) {
  // Safe extraction layer: Check if 'skills' is directly an array.
  // If it's an object containing an array field, extract it. Otherwise fallback to empty array.
  let safeSkillsArray = [];
  
  if (Array.isArray(skills)) {
    safeSkillsArray = skills;
  } else if (skills && typeof skills === 'object') {
    // Dynamically checks for common wrapper fields like .recentSkills, .data, or .skills
    safeSkillsArray = skills.recentSkills || skills.data || skills.skills || [];
  }

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-800">Recent Skills</h3>
        <p className="text-xs text-slate-500">Your latest tracking footprints</p>
      </div>

      {safeSkillsArray.length === 0 ? (
        <div className="text-sm text-slate-400 py-6 text-center border border-dashed border-slate-200 rounded-lg">
          No recent skills added yet.
        </div>
      ) : (
        <ul className="space-y-3">
          {safeSkillsArray.map((skill) => (
            <li 
              key={skill._id || skill.id} 
              className="text-sm border-b border-slate-100 pb-2 last:border-none last:pb-0"
            >
              <div className="font-semibold text-slate-800">{skill.skillName || skill.name}</div>
              <div className="text-xs text-slate-500 mt-0.5">{skill.category || skill.status}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default RecentSkills;