import {
  LOAD_CART,
  ADD_PRODUCT,
  UPDATE_CART,
  REMOVE_PRODUCT
} from "./actionTypes";

export const loadCart = (products) => (dispatch) => {
  dispatch({
    type: LOAD_CART,
    payload: products
   });
};

export const addProduct = (product) => (dispatch) => {
  dispatch({
    type: ADD_PRODUCT,
    payload: product
  });
};

export const removeProduct = (product) => (dispatch) => {
  dispatch({
    type: REMOVE_PRODUCT,
    payload: product
  });
};

export const updateCart = cartProducts => {
  let productQuantity = cartProducts.reduce((sum, p) => {
    if (p != null) {
      sum += parseInt(p.quantity) || 0;
      return sum;
    }

    return 0;
  }, 0);

  let totalPrice = cartProducts.reduce((sum, p) => {
    if (p != null) {
      sum += p.price * parseInt(p.quantity);
      return sum;
    }

    return 0;
  }, 0);

  let cartTotal = {
    productQuantity,
    totalPrice
  };

  localStorage.setItem("cartProducts", JSON.stringify(cartProducts));

  return {
    type: UPDATE_CART,
    payload: cartTotal
  };
};
