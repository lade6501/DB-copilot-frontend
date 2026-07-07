import { useState } from "react";

import { register } from "../../services/authService";
import { getErrorMessage } from "../../utils/apiError";

import type { RegisterRequest } from "../../types";

export function Register() {
  const [formData, setFormData] = useState<RegisterRequest>({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

    if (success) {
      setSuccess("");
    }
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {

      await register(formData);

      setSuccess(
        "Registration successful! Please sign in."
      );

      setFormData({
        username: "",
        email: "",
        password: "",
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
      onSubmit={handleSubmit}
    >
      <h2 className="auth-title">
        Create Account
      </h2>

      <span className="auth-subtitle">
        or use your email for registration
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
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
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
        <p className="auth-error">
          {error}
        </p>
      )}

      {success && (
        <p className="auth-success">
          {success}
        </p>
      )}

      <button
        type="submit"
        className="auth-btn"
        disabled={loading}
      >
        {loading
          ? "Creating Account..."
          : "Sign Up"}
      </button>

    </form>
  );
}