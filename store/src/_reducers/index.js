import { combineReducers } from "redux";
import customerReducer from "./customerReducer";
import productReducer from "./productReducers";
import adminReducer from "./adminReducer";
import cartReducer from "./cartReducer";
const rootReducer = combineReducers({
  customer: customerReducer,
  product: productReducer,
  admin: adminReducer,
  cart: cartReducer,
});

export default rootReducer;
