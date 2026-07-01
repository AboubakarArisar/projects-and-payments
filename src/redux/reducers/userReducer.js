import { LOGIN, LOGOUT } from "../actions/actionType";

const initialState = null;

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        user: {
          id: action.payload.id,
          email: action.payload.email,
          userName: action.payload.userName,
          type: action.payload.userType,
          token: action.payload.token,
          expire: action.payload.expire,
        },
      };
    case LOGOUT: {
      delete state["user"];
      return { ...state };
    }
    default:
      return state; 
  }
};

export default userReducer;
