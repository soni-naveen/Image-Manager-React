import { Routes, Route } from "react-router-dom";
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
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </>
  );
}
