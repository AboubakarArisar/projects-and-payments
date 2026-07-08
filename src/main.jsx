import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import "./index.css";
import AppRoutes from "./router/router.jsx";
import store, { persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <AppRoutes />
      {/* One global toaster for the whole app, styled to match the dark UI. */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2200,
          style: {
            background: "#0f172a",
            color: "#e2e8f0",
            border: "1px solid rgba(148, 163, 184, 0.18)",
            fontSize: "14px",
          },
          success: { iconTheme: { primary: "#22c55e", secondary: "#0f172a" } },
          error: {
            duration: 3200,
            iconTheme: { primary: "#f43f5e", secondary: "#0f172a" },
          },
        }}
      />
    </PersistGate>
  </Provider>
);
