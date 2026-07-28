import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { signupUser } from "../services/authService";
import AuthSlider from "../components/AuthSlider";


import team1 from "../assets/team1.png";
import team2 from "../assets/team2.png";
import team3 from "../assets/team3.png";
import team4 from "../assets/team4.png";

function Signup() {
  const images = [team1, team2, team3, team4];

  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      alert("All fields are required");
      return;
    }

    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const data = await signupUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      login(data.user, data.token);

      window.postMessage(
        {
          type: "EDUPULSE_AUTH_TOKEN",
          token: data.token,
        },
        "*"
      );

      alert("Signup Successful");

      navigate("/dashboard");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Signup Failed"
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
              Create Account
            </h1>

            <p className="text-zinc-400 mt-2 mb-8">
              Start your productivity journey.
            </p>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-white transition"
              />

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

              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-white transition"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black py-3 rounded-xl font-semibold hover:bg-gray-200 transition disabled:opacity-50"
              >
                {loading
                  ? "Creating Account..."
                  : "Create Account"}
              </button>
            </form>

            <p className="text-center text-zinc-400 mt-8">
              Already have an account?
              <Link
                to="/login"
                className="text-white ml-2 hover:underline"
              >
                Login
              </Link>
            </p>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Signup;