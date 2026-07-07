import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./components/Home";
import { AuthContainer } from "./components/auth/AuthContainer";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthProvider";

import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          <Route path="/auth" element={<AuthContainer />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
