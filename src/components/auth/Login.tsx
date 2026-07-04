import { useState } from "react";

import type { LoginRequest } from "../../types";
import { login } from "../../services/authService";

export function Login({ onSubmit }: { onSubmit?: () => void }) {
  const [formData, setFormData] = useState<LoginRequest>({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

   
    if (error) {
      setError("");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const result = await login(formData);

      localStorage.setItem("access_token", result.access_token);
      localStorage.setItem("isAuthenticated", "true");

      onSubmit?.();
    } catch (err: any) {
      setError(err?.message || "Unable to login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleLogin}>
      <h2 className="auth-title">Sign in</h2>

      <div className="auth-socials">
        <button type="button" className="social-btn">
          f
        </button>
        <button type="button" className="social-btn">
          G+
        </button>
        <button type="button" className="social-btn">
          in
        </button>
      </div>

      <span className="auth-subtitle">or use your account</span>

      <div className="auth-input-group">
        <input
          type="text"
          placeholder="User Name"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          disabled={loading}
        />

        <input
          type="password"
          placeholder="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          disabled={loading}
        />
      </div>

      {error && (
        <p
          style={{
            color: "#e74c3c",
            fontSize: "14px",
            marginTop: "8px",
            textAlign: "center",
          }}
        >
          {error}
        </p>
      )}

      <a href="#" className="auth-forgot">
        Forgot your password?
      </a>

      <button type="submit" className="auth-btn" disabled={loading}>
        {loading ? "Signing In..." : "Sign In"}
      </button>
    </form>
  );
}
