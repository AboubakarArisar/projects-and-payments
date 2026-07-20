import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

// Inverse of ProtectedRoute: a signed-in user has no business on the landing
// or auth pages, so bounce them to the app.
export default function GuestRoute() {
  const authenticated = useAuth();
  return authenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
}
