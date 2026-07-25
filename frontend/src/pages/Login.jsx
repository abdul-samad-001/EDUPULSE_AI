import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/authService";
import AuthSlider from "../components/AuthSlider";
import team1 from "../assets/team1.png";
import team2 from "../assets/team2.png";
import team3 from "../assets/team3.png";
import team4 from "../assets/team4.png";

function Login() {
  const images = [team1, team2, team3, team4];

  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      console.log("=== LOGIN START ===");
      const data = await loginUser({
        email: formData.email,
        password: formData.password,
      });
      login(data.user, data.token);
      console.log("Sending JWT to extension...");

if (
  window.chrome &&
  window.chrome.runtime &&
  typeof window.chrome.runtime.sendMessage === "function"
) {
  chrome.runtime.sendMessage(
    "jhbaidenokggbecmnkimcfkdeojodcic",
    {
      type: "SAVE_AUTH_TOKEN",
      token: data.token,
    },
    (response) => {
      if (chrome.runtime.lastError) {
        console.error(
          "Extension messaging error:",
          chrome.runtime.lastError
        );
        return;
      }

      console.log("Extension response:", response);
    }
  );
} else {
  console.warn(
    "Chrome runtime API is not available on this page."
  );
}
alert("Login Successful");
navigate("/dashboard");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-6xl h-[700px] rounded-3xl overflow-hidden bg-zinc-950 shadow-2xl grid lg:grid-cols-2">

        {/* LEFT SIDE */}
        <div className="hidden lg:block">
          <AuthSlider images={images} />
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center p-10">
          <div className="w-full max-w-md">

            <h1 className="text-4xl font-bold text-white">
              Welcome Back
            </h1>

            <p className="text-zinc-400 mt-2 mb-8">
              Login to continue your learning journey.
            </p>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-white transition"
              />

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-white transition"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black py-3 rounded-xl font-semibold hover:bg-gray-200 transition disabled:opacity-50"
              >
                {loading ? "Logging In..." : "Login"}
              </button>
            </form>

            <p className="text-center text-zinc-400 mt-8">
              Don't have an account?
              <Link
                to="/signup"
                className="text-white ml-2 hover:underline"
              >
                Sign Up
              </Link>
            </p>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;