import { Bell, Search } from "lucide-react";

function TopNavbar() {
  const user =
    JSON.parse(localStorage.getItem("user")) || {};

  return (
    <header className="bg-white border-b shadow-sm px-6 py-4 flex justify-between items-center">

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

      <div className="flex items-center gap-5">

        <Bell
          size={22}
          className="text-gray-600 cursor-pointer"
        />

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