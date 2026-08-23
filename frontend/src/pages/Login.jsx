import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/authService";
import AuthSlider from "../components/AuthSlider";
import { Button, toast } from "../components/ui";
import team1 from "../assets/team1.png";
import team2 from "../assets/team2.png";
import team3 from "../assets/team3.png";
import team4 from "../assets/team4.png";
import { LogIn, Eye, EyeOff, AlertCircle, Mail, Lock } from "lucide-react";

function Login() {
  const images = [team1, team2, team3, team4];

  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    // Clear error as user types
    if (errorMessage) setErrorMessage("");
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.email || !formData.password) {
      setErrorMessage("Please enter both your email address and password.");
      toast.warning("Missing Fields", {
        description: "Please enter both your email address and password.",
      });
      return;
    }

    try {
      setLoading(true);

      const data = await loginUser({
        email: formData.email.trim(),
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
      const msg =
        error.response?.data?.message ||
        "Invalid email or password. Please check your credentials and try again.";
      setErrorMessage(msg);
      toast.error("Login Failed", { description: msg });
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

            <h1 className="text-3xl sm:text-4xl font-extrabold text-dark-text tracking-tight">
              Welcome Back
            </h1>

            <p className="text-dark-muted mt-2 mb-6 text-sm">
              Login to continue your learning journey on EduPulse AI.
            </p>

            {/* Red Error Banner if Wrong Password / Email */}
            {errorMessage && (
              <div className="mb-5 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span className="font-semibold leading-relaxed">{errorMessage}</span>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              autoComplete="off"
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-dark-muted mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-dark-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    name="email"
                    autoComplete="off"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className={`w-full bg-dark-bg rounded-xl pl-10 pr-4 py-3 text-dark-text text-sm outline-none transition-all ${
                      errorMessage
                        ? "border-2 border-rose-500/80 bg-rose-500/5 focus:border-rose-500"
                        : "border border-dark-border focus:border-primary/50"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-dark-muted mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-dark-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full bg-dark-bg rounded-xl pl-10 pr-11 py-3 text-dark-text text-sm outline-none transition-all ${
                      errorMessage
                        ? "border-2 border-rose-500/80 bg-rose-500/5 focus:border-rose-500"
                        : "border border-dark-border focus:border-primary/50"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-dark-muted hover:text-dark-text p-1 transition-colors"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-primary" />
                    ) : (
                      <Eye className="w-4 h-4 text-dark-muted" />
                    )}
                  </button>
                </div>
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