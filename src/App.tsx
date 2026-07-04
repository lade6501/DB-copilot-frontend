import { useEffect, useState, type ReactNode } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import Home from "./components/Home";
import { AuthContainer } from "./components/auth/AuthContainer";
import "./index.css";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const location = useLocation();
  const isAuthenticated =
    typeof window !== "undefined" &&
    Boolean(localStorage.getItem("isAuthenticated"));

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    Boolean(localStorage.getItem("isAuthenticated")),
  );

  useEffect(() => {
    const syncAuth = () => {
      setIsAuthenticated(Boolean(localStorage.getItem("isAuthenticated")));
    };

    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/auth"
          element={
            isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <AuthContainer onAuthSuccess={() => setIsAuthenticated(true)} />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
