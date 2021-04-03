import {applyMiddleware, createStore} from "redux";
import thunk from "react-thunk";
import {composeWithDevTools} from "redux-devtools-extension";
import cart from "./reducers/cart";

const middleware = [thunk];

const store = createStore(
  cart,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
