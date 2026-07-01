import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import "./index.css";
import AppRoutes from "./router/router.jsx";
import store, { persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <AppRoutes />
    </PersistGate>
  </Provider>
);
