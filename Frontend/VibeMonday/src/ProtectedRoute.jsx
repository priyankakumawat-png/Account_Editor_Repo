import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const token = localStorage.getItem("UserToken");

  return token ? <Outlet /> : <Navigate to="/signin" replace />;
}