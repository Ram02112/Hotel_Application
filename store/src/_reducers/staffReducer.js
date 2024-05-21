import { STAFF_AUTH, STAFF_LOGIN, STAFF_LOGOUT } from "../_actions/types";

const initialState = {
  staffAuth: null,
};

const staffReducer = (state = initialState, action) => {
  switch (action.type) {
    case STAFF_LOGIN:
      return {
        staffAuth: {
          data: action.payload?.data?.staff,
          status: action.payload?.status,
        },
      };
    case STAFF_AUTH:
      return {
        staffAuth: action.payload,
      };
    case STAFF_LOGOUT:
      const isAuth = action.payload.status;
      return {
        staffAuth: !isAuth,
      };

    default:
      return state;
  }
};

export default staffReducer;
