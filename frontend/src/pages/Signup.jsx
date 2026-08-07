import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { signupUser } from "../services/authService";
import AuthSlider from "../components/AuthSlider";
import { Button } from "../components/ui";
import team1 from "../assets/team1.png";
import team2 from "../assets/team2.png";
import team3 from "../assets/team3.png";
import team4 from "../assets/team4.png";
import { UserPlus } from "lucide-react";

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
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-6 text-dark-text">
      <div className="w-full max-w-6xl h-180 rounded-card overflow-hidden bg-dark-card border border-dark-border shadow-2xl grid lg:grid-cols-2">

        {/* LEFT SIDE */}
        <div className="hidden lg:block">
          <AuthSlider images={images} />
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center p-8 sm:p-12 overflow-y-auto">
          <div className="w-full max-w-md">

            <h1 className="text-4xl font-extrabold text-dark-text tracking-tight">
              Create Account
            </h1>

            <p className="text-dark-muted mt-2 mb-6">
              Start your productivity journey on EduPulse AI today.
            </p>

            <form
              onSubmit={handleSubmit}
              className="space-y-3.5"
            >
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-dark-muted mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-2.5 text-dark-text text-sm outline-none focus:border-primary/50 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-dark-muted mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-2.5 text-dark-text text-sm outline-none focus:border-primary/50 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-dark-muted mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-2.5 text-dark-text text-sm outline-none focus:border-primary/50 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-dark-muted mb-1.5">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-2.5 text-dark-text text-sm outline-none focus:border-primary/50 transition"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                size="lg"
                loading={loading}
                icon={UserPlus}
                className="mt-2"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <p className="text-center text-dark-muted text-sm mt-6">
              Already have an account?
              <Link
                to="/login"
                className="text-primary font-semibold ml-2 hover:underline"
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