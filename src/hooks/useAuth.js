import { useSelector } from "react-redux";

export default function useAuth() {
  const userState = useSelector((state) => state?.user);
  if (userState?.user) {
    return true;
  } else return false;
}
