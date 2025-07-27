import { Routes, Route } from "react-router-dom";
import OpenRoute from "./components/auth/OpenRoute.jsx";
import PrivateRoute from "./components/auth/PrivateRoute.jsx";
import Home from "./pages/Home.jsx";
import Signup from "./pages/auth/signup.jsx";
import Login from "./pages/auth/login.jsx";
import ForgotPassword from "./pages/auth/forgot-password.jsx";
import ResetPassword from "./pages/auth/reset-password.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Error from "./pages/Error.jsx";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/signup"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />
        <Route
          path="/login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <OpenRoute>
              <ForgotPassword />
            </OpenRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <OpenRoute>
              <ResetPassword />
            </OpenRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Error />} />
      </Routes>
    </>
  );
}
