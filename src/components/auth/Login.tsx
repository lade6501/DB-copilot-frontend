import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import { getErrorMessage } from "../../utils/apiError";

import type { LoginRequest } from "../../types";

export function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [formData, setFormData] = useState<LoginRequest>({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleLogin = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    setLoading(true);
    setError("");

    try {

      await login(formData);

      navigate("/", {
        replace: true,
      });

    } catch (error) {

      setError(
        getErrorMessage(error)
      );

    } finally {

      setLoading(false);

    }

  };

  return (
    <form
      className="auth-form"
      onSubmit={handleLogin}
    >
      <h2 className="auth-title">
        Sign in
      </h2>

      <div className="auth-socials">
        <button
          type="button"
          className="social-btn"
        >
          f
        </button>

        <button
          type="button"
          className="social-btn"
        >
          G+
        </button>

        <button
          type="button"
          className="social-btn"
        >
          in
        </button>
      </div>

      <span className="auth-subtitle">
        or use your account
      </span>

      <div className="auth-input-group">

        <input
          type="text"
          name="username"
          placeholder="User Name"
          value={formData.username}
          onChange={handleChange}
          disabled={loading}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          disabled={loading}
          required
        />

      </div>

      {error && (
        <p
          className="auth-error"
        >
          {error}
        </p>
      )}

      <a
        href="#"
        className="auth-forgot"
      >
        Forgot your password?
      </a>

      <button
        type="submit"
        className="auth-btn"
        disabled={loading}
      >
        {loading
          ? "Signing In..."
          : "Sign In"}
      </button>

    </form>
  );
}