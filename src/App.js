 import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import AddQuestion from "./pages/AddQuestion";
import QuestionsList from "./pages/QuestionsList";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard"; // ✅ unified dashboard
// (this is the role-aware dashboard we built earlier)

const Unauthorized = () => <h2>🚫 403 - Unauthorized</h2>;

// ✅ Landing Page
const Landing = () => (
  <div className="page-container">
    <h1>Welcome to Skill Portal 🚀</h1>
    <p>Please login or register to continue.</p>
  </div>
);

function App() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Router>
      {/* Global Navbar */}
      <Navbar />

      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Landing Page */}
        <Route
          path="/"
          element={
            !user ? (
              <Landing />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />

        {/* ✅ Unified Dashboard (admin + user) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["user", "admin"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Questions List (user + admin) */}
        <Route
          path="/questions"
          element={
            <ProtectedRoute allowedRoles={["user", "admin"]}>
              <QuestionsList />
            </ProtectedRoute>
          }
        />

        {/* Add Question (admin only) */}
        <Route
          path="/add-question"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AddQuestion />
            </ProtectedRoute>
          }
        />

        {/* Unauthorized Page */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Catch-all Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
