function LeaderboardWidget({ users }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">

      <h2 className="text-xl font-bold mb-5">
        🏆 Top Students
      </h2>

      {users.slice(0,3).map((user)=>(
        <div
          key={user.userId}
          className="flex justify-between py-2 border-b"
        >

          <span>
            #{user.rank} {user.name}
          </span>

          <span className="font-bold text-blue-600">
            {user.totalXP}
          </span>

        </div>
      ))}

    </div>
  );
}

export default LeaderboardWidget;