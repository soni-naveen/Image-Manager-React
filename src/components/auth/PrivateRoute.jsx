import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");

  const isTokenValid = () => {
    if (!token) return false;

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      return decoded.exp && decoded.exp > currentTime;
    } catch (error) {
      console.error("Invalid token", error);
      return false;
    }
  };

  if (isTokenValid()) {
    return children;
  } else {
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }
}

export default PrivateRoute;
