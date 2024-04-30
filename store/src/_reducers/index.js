import { combineReducers } from "redux";
import customerReducer from "./customerReducer";
import productReducer from "./productReducers";
import adminReducer from "./adminReducer";
import cartReducer from "./cartReducer";
import orderReducer from "./orderReducer";
const rootReducer = combineReducers({
  customer: customerReducer,
  product: productReducer,
  admin: adminReducer,
  cart: cartReducer,
  order: orderReducer,
});

export default rootReducer;
