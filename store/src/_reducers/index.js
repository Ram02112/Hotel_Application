import { combineReducers } from "redux";
import customerReducer from "./customerReducer";
import productReducer from "./productReducers";
import adminReducer from "./adminReducer";
import cartReducer from "./cartReducer";
import orderReducer from "./orderReducer";
import staffReducer from "./staffReducer";
const rootReducer = combineReducers({
  customer: customerReducer,
  product: productReducer,
  admin: adminReducer,
  cart: cartReducer,
  order: orderReducer,
  staff: staffReducer,
});

export default rootReducer;
