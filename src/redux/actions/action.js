import { LOGIN, LOGOUT } from "./actionType";

export const loginUser = (id, email, userName, type, token, expire) => ({
  type: LOGIN,
  payload: {
    id,
    email,
    userName,
    type,
    token,
    expire,
  },
});

export const logoutUser = () => ({
  type: LOGOUT,
});
