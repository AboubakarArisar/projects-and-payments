import { useSelector } from "react-redux";

export default function useAuth() {
  const user = useSelector((state) => state?.user?.user);
  if (!user?.token) return false;
  // Treat an expired session as logged out (the server enforces this too).
  if (user.expire && Date.now() > user.expire) return false;
  return true;
}
