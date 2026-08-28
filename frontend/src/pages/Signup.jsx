import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { signupUser } from "../services/authService";
import AuthSlider from "../components/AuthSlider";
import { Button, toast } from "../components/ui";
import team1 from "../assets/team1.png";
import team2 from "../assets/team2.png";
import team3 from "../assets/team3.png";
import team4 from "../assets/team4.png";
import logoImg from "../assets/logo.png";
import { UserPlus, Eye, EyeOff, AlertCircle, User, Mail, Lock } from "lucide-react";

function Signup() {
  const images = [team1, team2, team3, team4];

  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    if (errorMessage) setErrorMessage("");
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      const msg = "Please fill in all required fields to register.";
      setErrorMessage(msg);
      toast.warning("Missing Fields", { description: msg });
      return;
    }

    if (formData.password.length < 6) {
      const msg = "Password must be at least 6 characters long.";
      setErrorMessage(msg);
      toast.warning("Password Too Short", { description: msg });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      const msg = "Passwords do not match. Please verify both password entries.";
      setErrorMessage(msg);
      toast.warning("Passwords Do Not Match", { description: msg });
      return;
    }

    try {
      setLoading(true);

      const data = await signupUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      login(data.user, data.token);

      toast.success("Account Created!", {
        description: `Welcome to EduPulse AI, ${data.user?.name || formData.name}!`,
      });
      navigate("/dashboard");
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        "Could not create account. Please check your details and try again.";
      setErrorMessage(msg);
      toast.error("Signup Failed", { description: msg });
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

            {/* Brand Logo Link */}
            <Link to="/" className="inline-flex items-center gap-2.5 mb-5 group">
              <img
                src={logoImg}
                alt="EduPulse AI Logo"
                className="w-8 h-8 rounded-full object-cover shadow-md border border-primary/30 group-hover:scale-105 transition-transform"
              />
              <span className="text-lg font-bold text-dark-text tracking-tight">
                EduPulse<span className="text-primary">.AI</span>
              </span>
            </Link>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-dark-text tracking-tight">
              Create Account
            </h1>

            <p className="text-dark-muted mt-2 mb-5 text-sm">
              Start your productivity journey on EduPulse AI today.
            </p>

            {/* Error Banner */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span className="font-semibold leading-relaxed">{errorMessage}</span>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              autoComplete="off"
              className="space-y-3.5"
            >
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-dark-muted mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-dark-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="name"
                    autoComplete="off"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full bg-dark-bg border border-dark-border rounded-xl pl-10 pr-4 py-2.5 text-dark-text text-sm outline-none focus:border-primary/50 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-dark-muted mb-1.5">
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
                    className={`w-full bg-dark-bg rounded-xl pl-10 pr-4 py-2.5 text-dark-text text-sm outline-none transition ${
                      errorMessage && !formData.email
                        ? "border-2 border-rose-500/80 bg-rose-500/5 focus:border-rose-500"
                        : "border border-dark-border focus:border-primary/50"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-dark-muted mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-dark-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full bg-dark-bg rounded-xl pl-10 pr-11 py-2.5 text-dark-text text-sm outline-none transition ${
                      errorMessage && formData.password.length < 6
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

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-dark-muted mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-dark-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full bg-dark-bg rounded-xl pl-10 pr-11 py-2.5 text-dark-text text-sm outline-none transition ${
                      errorMessage && formData.password !== formData.confirmPassword
                        ? "border-2 border-rose-500/80 bg-rose-500/5 focus:border-rose-500"
                        : "border border-dark-border focus:border-primary/50"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-dark-muted hover:text-dark-text p-1 transition-colors"
                    title={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? (
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