import axios from "axios";
import store from "../redux/store";
import { logoutUser } from "../redux/actions/action";

// Attach the persisted JWT to every outgoing request.
axios.interceptors.request.use((config) => {
  const token = store.getState()?.user?.user?.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If the server rejects our token (missing / invalid / expired), drop the
// session and send the user back to sign in — but don't loop on the login page.
axios.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(logoutUser());
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
