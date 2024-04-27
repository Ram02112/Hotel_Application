import { ADMIN_AUTH, ADMIN_LOGIN, ADMIN_LOGOUT } from "../_actions/types";

const initialState = {
  adminAuth: null,
};

const adminReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADMIN_LOGIN:
      console.log("login payload: ", action.payload);
      return {
        adminAuth: {
          data: action.payload?.data?.admin,
          status: action.payload?.status,
        },
      };
    case ADMIN_AUTH:
      return {
        adminAuth: action.payload,
      };
    case ADMIN_LOGOUT:
      const isAuth = action.payload.status;
      return {
        adminAuth: !isAuth,
      };

    default:
      return state;
  }
};

export default adminReducer;
