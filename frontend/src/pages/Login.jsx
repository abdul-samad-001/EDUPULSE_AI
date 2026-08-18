import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/authService";
import AuthSlider from "../components/AuthSlider";
import { Button, toast } from "../components/ui";
import team1 from "../assets/team1.png";
import team2 from "../assets/team2.png";
import team3 from "../assets/team3.png";
import team4 from "../assets/team4.png";
import { LogIn } from "lucide-react";

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
      toast.warning("Missing Fields", {
        description: "Please enter both your email address and password.",
      });
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

      // Send token to Chrome Extension via window.postMessage
      window.postMessage(
        {
          type: "EDUPULSE_AUTH_TOKEN",
          token: data.token,
        },
        "*"
      );

      toast.success("Welcome back!", {
        description: `Logged in as ${data.user?.name || formData.email}. Redirecting...`,
      });
      navigate("/dashboard");
    } catch (error) {
      toast.error("Login Failed", {
        description:
          error.response?.data?.message ||
          "Invalid email or password. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-6 text-dark-text">
      <div className="w-full max-w-6xl h-175 rounded-card overflow-hidden bg-dark-card border border-dark-border shadow-2xl grid lg:grid-cols-2">

        {/* LEFT SIDE */}
        <div className="hidden lg:block">
          <AuthSlider images={images} />
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center p-8 sm:p-12">
          <div className="w-full max-w-md">

            <h1 className="text-4xl font-extrabold text-dark-text tracking-tight">
              Welcome Back
            </h1>

            <p className="text-dark-muted mt-2 mb-8">
              Login to continue your learning journey on EduPulse AI.
            </p>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-dark-muted mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-dark-text text-sm outline-none focus:border-primary/50 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-dark-muted mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-dark-text text-sm outline-none focus:border-primary/50 transition"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                size="lg"
                loading={loading}
                icon={LogIn}
                className="mt-2"
              >
                {loading ? "Logging In..." : "Login"}
              </Button>
            </form>

            <p className="text-center text-dark-muted text-sm mt-8">
              Don't have an account?
              <Link
                to="/signup"
                className="text-primary font-semibold ml-2 hover:underline"
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