import React, { useContext } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Amnex from "./pages/Amnex";
import SwitchPage from "./pages/Switch";
import OGL from "./pages/OGL";
import Data from "./pages/Data";
import LowFloor from "./pages/LowFloor";

// ✅ PrivateRoute for role-based protection
const PrivateRoute = ({ children, role }) => {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" />;

  if (role === "admin" && user.role !== "admin") return <Navigate to="/home" />;

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />

          {/* Admin Dashboard */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute role="admin">
                <Dashboard />
              </PrivateRoute>
            }
          />

          {/* User Home */}
          <Route
            path="/home"
            element={
              <PrivateRoute role="user">
                <Home />
              </PrivateRoute>
            }
          />

          {/* Other pages */}
          <Route path="/amnex" element={<Amnex />} />
          <Route path="/LowFloor" element={<LowFloor />} />
          <Route path="/switch" element={<SwitchPage />} />
          <Route path="/OGL" element={<OGL />} />
          <Route path="/Data" element={<Data />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;