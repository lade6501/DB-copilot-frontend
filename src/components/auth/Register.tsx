import { useState } from "react";

import type { RegisterRequest } from "../../types";
import { register } from "../../services/authService";

export function Register() {
  const [formData, setFormData] = useState<RegisterRequest>({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await register(formData);

      setSuccess("Registration successful! Please sign in.");

      setFormData({
        username: "",
        email: "",
        password: "",
      });
    } catch (err: any) {
      setError(err?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2 className="auth-title">Create Account</h2>

      <span className="auth-subtitle">or use your email for registration</span>

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
          type="email"
          placeholder="Email"
          name="email"
          value={formData.email}
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

      {error && <p className="auth-error">{error}</p>}

      {success && <p className="auth-success">{success}</p>}

      <button type="submit" className="auth-btn" disabled={loading}>
        {loading ? "Creating Account..." : "Sign Up"}
      </button>
    </form>
  );
}
