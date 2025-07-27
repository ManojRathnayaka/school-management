// React imports
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      } else {
        const response = await axios.post(
          "/api/reset-password-first-login",
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
        navigate("/dashboard");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "An error occurred.";
      setFormError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <Alert type="error" message={error} />
        <Alert type="info" message={serverMessage} />

        <Input
          type="email"
          name="email"
          placeholder="Email"
          className="mb-4"
          value={form.email}
          onChange={handleInputChange}
          required
          autoFocus
        />
        
        {!mustReset && (
          <Input
            type="password"
            name="password"
            placeholder="Password"
            className="mb-4"
            value={form.password}
            onChange={handleInputChange}
            required
          />
        )}

        {mustReset && (
          <>
            <Input
              type="password"
              name="newPassword"
              placeholder="New Password"
              className="mb-4"
              value={form.newPassword}
              onChange={handleInputChange}
              required
            />
            <Input
              type="password"
              name="confirmPassword"
              placeholder="Confirm New Password"
              className="mb-6"
              value={form.confirmPassword}
              onChange={handleInputChange}
              required
            />
          </>
        )}
        <Button
          type="submit"
          variant={mustReset ? "secondary" : "primary"}
          className="w-full"
        >
          {mustReset ? "Set New Password" : "Login"}
        </Button>
      </form>
    </div>
  );
}