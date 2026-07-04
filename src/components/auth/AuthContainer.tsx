import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Login } from "./Login";
import { Register } from "./Register";

export function AuthContainer({
  onAuthSuccess,
}: {
  onAuthSuccess?: () => void;
}) {
  const [isSignUpActive, setIsSignUpActive] = useState(false);
  const navigate = useNavigate();

  const handleAuthSuccess = () => {
    localStorage.setItem("isAuthenticated", "true");
    onAuthSuccess?.();
    navigate("/", { replace: true });
  };

  return (
    <div className="auth-wrapper">
      <div
        className={`auth-container ${isSignUpActive ? "right-panel-active" : ""}`}
      >
        <div className="form-container sign-up-container">
          <Register />
        </div>

        <div className="form-container sign-in-container">
          <Login onSubmit={handleAuthSuccess} />
        </div>

        <div className="overlay-container">
          <svg
            className="wave-edge wave-left"
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
          >
            <path d="M 100 0 L 50 0 C 10 30, 90 70, 50 100 L 100 100 Z" />
          </svg>

          <svg
            className="wave-edge wave-right"
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
          >
            <path d="M 0 0 L 50 0 C 90 30, 10 70, 50 100 L 0 100 Z" />
          </svg>

          <div className="overlay-panel overlay-left">
            <h2>Welcome Back!</h2>
            <p>
              To keep connected with us please login with your personal info
            </p>
            <button
              className="auth-btn auth-btn--ghost"
              onClick={() => setIsSignUpActive(false)}
            >
              Sign In
            </button>
          </div>

          <div className="overlay-panel overlay-right">
            <h2>Hello, Friend!</h2>
            <p>Enter your personal details and start your journey with us</p>
            <button
              className="auth-btn auth-btn--ghost"
              onClick={() => setIsSignUpActive(true)}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
