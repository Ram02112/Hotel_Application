import { applyMiddleware, compose, createStore } from "redux";
import promiseMiddleware from "redux-promise";
import { thunk } from "redux-thunk";
import rootReducer from "../_reducers";

const composeEnhancers =
  typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        shouldHotReload: false,
      })
    : compose;

const configureStore = () => {
  const store = createStore(
    rootReducer,
    {},
    composeEnhancers(applyMiddleware(promiseMiddleware, thunk))
  );
  return store;
};

export default configureStore;
