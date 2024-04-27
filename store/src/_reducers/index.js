import { combineReducers } from "redux";
import customerReducer from "./customerReducer";
import productReducer from "./productReducers";
import adminReducer from "./adminReducer";

const rootReducer = combineReducers({
  customer: customerReducer,
  product: productReducer,
  admin: adminReducer,
});

export default rootReducer;
