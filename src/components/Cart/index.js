import React, { useState, useEffect } from "react";
import * as PropTypes from "prop-types";
import storage from "../../storage";
import {makeStyles} from '@material-ui/core/styles'
import {formatPrice} from "../../helpers";
import {useDispatch, useSelector} from "react-redux";
import {loadCart, updateCart} from "../../actions/cart";
import CartProduct from "./CartProduct";

const Cart = (props) => {
  const {products: cartProducts2, productToAdd, productToRemove} = useSelector(state => state.cart);
  const cartTotal = useSelector(state => state.cart.data);

  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    dispatch(loadCart(JSON.parse(localStorage.getItem("cartProducts"))) || []);
  });

  useEffect(() => {
    setTimeout(() => {
      dispatch(loadCart(props.cartProducts));
    }, 0);
  }, []);

  useEffect(() => {
    if (productToAdd !== props.productToAdd) {
      addProduct(productToAdd);
    }

    if (productToRemove !== props.productToRemove) {
      removeProduct(productToRemove);
    }
  }, [props.productToAdd, props.productToRemove]);

  const openFloatCart = () => {
    setIsOpen(true);
  };

  const closeFloatCart = () => {
    setIsOpen(false);
  };

  const addProduct = product => {
    const {cartProducts} = props;
    let productAlreadyInCart = false;
    cartProducts &&
    cartProducts.forEach(cp => {
      if (cp.id === product.id) {
        cp.quantity = parseInt(cp.quantity) + parseInt(product.quantity);
        productAlreadyInCart = true;
      }
    });

    if (!productAlreadyInCart) {
      cartProducts.push(product);
    }
    dispatch(updateCart(cartProducts));
    openFloatCart();
  };

  const removeProduct = product => {
    const { cartProducts, updateCart } = props;

    const index = cartProducts.findIndex(product => product.id === product.id);
    if (index >= 0) {
      cartProducts.splice(index, 1);
      updateCart(cartProducts);
      // dispatch(updateCart(cartProducts));
    }
  };

  const clickCheckout = () => {
    // const { cartProducts, , ahandleCheckout } = props;
    // const data = {
    //   products: cartProducts,
    //   total: cartTotal
    // };
    // handleCheckout(data);
  };

  const useStyles = makeStyles((theme) => (props.className));
  const styleClass = useStyles();

  const {
    currencySymbol,
    cartProducts,
    subTotalTextLabel,
    quantityTextLabel,
    cartTextLabel,
    checkoutTextLabel
  } = props;

  let classes = ["float"];

  if (!!isOpen) {
    classes.push("float-open");
  }

  return (
    <div className={classes.join(" ")}>
      {isOpen && (
        <div
          onClick={() => closeFloatCart()}
          className="float-close-btn"
        >
          X
        </div>
      )}
      {!isOpen && (
        <span
          onClick={() => openFloatCart()}
          className="bag bag--float-cart-closed"
        >
            <span className="bag__quantity">{cartTotal.productQuantity}</span>
          </span>
      )}

      <div className="float-cart__content">
        <div className="float-cart__header">
            <span className="bag">
              <span className="bag__quantity">{cartTotal.productQuantity}</span>
            </span>
          <span className="header-title">{cartTextLabel}</span>
        </div>

        <div className="float-cart__shelf-container">
          {cartProducts && cartProducts.map(product => {
            return (
              <CartProduct
                product={product}
                removeProduct={removeProduct}
                currencySymbol={currencySymbol}
                key={product && product.id}
                quantityTextLabel={quantityTextLabel}
              />
            )})}
          {cartProducts === undefined ||
          (cartProducts.length == 0 && (
            <p className="shelf-empty">
              Add some products in the cart <br />
              :)
            </p>
          ))}
        </div>

        <div className="float-cart__footer">
          <div className="sub">subTotalTextLabel}</div>
          <div className="sub-price">
            <p className="sub-price__val">
              {`${formatPrice(cartTotal.totalPrice, currencySymbol)}`}
            </p>
          </div>
          <div onClick={clickCheckout} className="continue-btn">
            {checkoutTextLabel}
          </div>
        </div>
      </div>
    </div>
  );
};

Cart.propTypes = {
  loadCart: PropTypes.func,
  cartProducts: PropTypes.array,
  updateCart: PropTypes.func,
  productToAdd: PropTypes.object,
  removeProduct: PropTypes.func,
  productToRemove: PropTypes.object,
  currencySymbol: PropTypes.string,
  handleCheckout: PropTypes.func,
  checkoutTextLabel: PropTypes.string,
  cartTextLabel: PropTypes.string,
  subTotalTextLabel: PropTypes.string,
  quantityTextLabel: PropTypes.string,
  className: PropTypes.object
};

Cart.defaultProps = {
  currencySymbol: "Php",
  checkoutTextLabel: "Checkout",
  cartTextLabel: "Your Cart",
  subTotalTextLabel: "Sub Total",
  quantityTextLabel: "Quantity",
  className: {},
  cartProducts: []
};

export default Cart;
