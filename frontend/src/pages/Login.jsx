// React imports
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

// Context imports
import { useAuth } from "../context/AuthContext";

// Service imports
import axios from "axios";
import { useForm } from "../hooks/useForm";
import Alert from "../components/Alert";
import Button from "../components/Button";
import Input from "../components/Input";

const initialForm = {
  email: "",
  password: "",
  newPassword: "",
  confirmPassword: "",
};

export default function Login() {
  const [serverMessage, setServerMessage] = useState("");
  const [mustReset, setMustReset] = useState(false);
  const [tempPassword, setTempPassword] = useState(""); // Store the temp password separately
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { form, error, setFormError, handleInputChange, resetForm } =
    useForm(initialForm);
  const { login, setUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setServerMessage("");

    try {
      if (!mustReset) {
        const data = await login(form.email, form.password);
        if (data.mustResetPassword) {
          setMustReset(true);
          setTempPassword(form.password); // Store the password as temp password
          setServerMessage(data.message);
        } else if (data.user?.role === "admin") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
      } else {
        const response = await axios.post(
          "/api/auth/reset-password-first-login",
          {
            email: form.email,
            tempPassword: tempPassword, // Use stored temp password
            newPassword: form.newPassword,
            confirmPassword: form.confirmPassword,
          },
          { headers: { "Content-Type": "application/json" } }
        );
        setUser(response.data.user);
        resetForm();

        // Navigate based on role after password reset
        if (response.data.user?.role === "admin") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "An error occurred.";
      setFormError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 relative overflow-hidden">
      {/* Floating blurred bubbles */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-300/40 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-16 w-24 h-24 bg-blue-400/30 rounded-full blur-lg animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-12 w-40 h-40 bg-blue-200/50 rounded-full blur-2xl animate-pulse delay-500"></div>
        <div className="absolute bottom-20 right-20 w-20 h-20 bg-blue-500/25 rounded-full blur-md animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/3 w-28 h-28 bg-blue-300/35 rounded-full blur-xl animate-pulse delay-300"></div>
        <div className="absolute top-1/3 right-1/4 w-36 h-36 bg-blue-400/20 rounded-full blur-2xl animate-pulse delay-1200"></div>
      </div>
      
      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-white/70 backdrop-blur-md border border-white/30 p-8 rounded-2xl shadow-xl w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-800">Login</h2>
        <Alert type="error" message={error} />
        <Alert type="info" message={serverMessage} />

        <div className="relative mb-4">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" />
          <Input
            type="email"
            name="email"
            placeholder="Email"
            className="pl-10 rounded-xl bg-white/80 border-blue-200 focus:border-blue-400 focus:bg-white/90"
            value={form.email}
            onChange={handleInputChange}
            required
            autoFocus
          />
        </div>

        {!mustReset && (
          <div className="relative mb-4">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" />
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="pl-10 pr-10 rounded-xl bg-white/80 border-blue-200 focus:border-blue-400 focus:bg-white/90"
              value={form.password}
              onChange={handleInputChange}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-700"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        )}

        {mustReset && (
          <>
            <p className="text-sm text-blue-700 mb-2 bg-blue-50/80 p-3 rounded-xl border border-blue-100">
              Password needs at least 6 characters including letters and numbers
            </p>
            <div className="relative mb-4">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" />
              <Input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                placeholder="New Password"
                className="pl-10 pr-10 rounded-xl bg-white/80 border-blue-200 focus:border-blue-400 focus:bg-white/90"
                value={form.newPassword}
                onChange={handleInputChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-700"
              >
                {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            <div className="relative mb-6">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" />
              <Input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm New Password"
                className="pl-10 pr-10 rounded-xl bg-white/80 border-blue-200 focus:border-blue-400 focus:bg-white/90"
                value={form.confirmPassword}
                onChange={handleInputChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-700"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </>
        )}
        <Button
          type="submit"
          variant={mustReset ? "secondary" : "primary"}
          className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg"
        >
          {mustReset ? "Set New Password" : "Login"}
        </Button>
      </form>
    </div>
  );
}