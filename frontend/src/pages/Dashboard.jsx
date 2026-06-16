import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
function Dashboard() {
    const user = JSON.parse(
        localStorage.getItem("user")
    );
    const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    }
  }, [navigate]);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };
  return (
    <div className="p-20 text-4xl font-bold">
      Dashboard 🚀
      <h1>
        Welcome, {user?.name}
      </h1>
      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default Dashboard;