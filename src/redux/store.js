import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

import { thunk } from "redux-thunk"; // Changed line

import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import userReducer from "./reducers/userReducer";

const persistConfig = {
  key: "projects-payments",
  storage,
};
const middleware = [thunk];

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    user: userReducer,
  })
);

const store = createStore(
  persistedReducer,
  composeWithDevTools(applyMiddleware(...middleware))
);

const persistor = persistStore(store);

export default store;
export { persistor };
