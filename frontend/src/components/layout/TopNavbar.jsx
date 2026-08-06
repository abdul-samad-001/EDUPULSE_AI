import { Search } from "lucide-react";
import { NotificationBell } from "../notifications";

function TopNavbar() {
  const user =
    JSON.parse(localStorage.getItem("user")) || {};

  return (
    <header className="flex justify-between items-center bg-white border-b px-6 py-3">

      {/* Search */}
      <div className="flex items-center gap-3">

        <Search
          size={20}
          className="text-gray-500"
        />

        <input
          type="text"
          placeholder="Search..."
          className="outline-none bg-transparent"
        />

      </div>

      {/* Right Side */}
      <div className="flex items-center gap-5">

        <NotificationBell />

        <div className="text-right">

          <h4 className="font-semibold">
            {user.name || "User"}
          </h4>

          <p className="text-sm text-gray-500">
            Learner
          </p>

        </div>

      </div>

    </header>
  );
}

export default TopNavbar;