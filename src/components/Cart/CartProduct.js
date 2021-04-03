import React, { useEffect, useState } from "react";
import * as PropTypes from "prop-types";
import {makeStyles} from '@material-ui/core/styles'
import Thumb from "./Thumb";
import { formatPrice } from "../../helpers";
import {useDispatch, useSelector} from "react-redux";
import {updateCart} from "../../actions/cart";

const CartProduct = (props) => {
  const {products: cartProducts, productToAdd} = useSelector(state => state.cart);

  const dispatch = useDispatch();

  const [isMouseOver, setIsMouseOver] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);

  useEffect(() => {
    if(props.product) {
      setQuantity(props.product.quantity);
      setPrice(props.product.price);
    }
  }, [props.product]);

  const handleMouseOver = () => {
    setIsMouseOver(true);
  };

  const handleMouseOut = () => {
    setIsMouseOver(false);
  };

  const handleChange = (event) => {
    const {value} = event.target;
    const {price} = props.product;
    const {cartProducts} = props;

    const regex = /^[0-9\b]+$/;
    if (value === '' || regex.test(value)) {
      setQuantity(value);
      setPrice((price * value));

      cartProducts && cartProducts.forEach(cp => {
        if (cp.id === props.product.id) {
          cp.quantity = parseInt(value);
        }
      });

      dispatch(updateCart(cartProducts));
    }
  };

  const useStyles = makeStyles((theme) => (props.className));

  const {product, removeProduct, currencySymbol, quantityTextLabel} = props;

  const styleClass = useStyles();

  const classes = ["shelf-item"];

  if (!!isMouseOver) {
    classes.push("shelf-item--mouseover");
  }

  return (
    <div className={classes.join(" ")}>
      <div
        className="shelf-item__del"
        onMouseOver={() => handleMouseOver()}
        onMouseOut={() => handleMouseOut()}
        onClick={() => removeProduct(product)}
      />
      {product &&
        <Thumb
          classes="shelf-item__thumb"
          src={product.image || "https://via.placeholder.com/150"}
          alt={product.name}
        />
      }
      <div className="shelf-item__details">
        {product && <p className="title">{product.name}</p>}
        <p className="desc">
          {quantityTextLabel}: <input type="text" name="quantity" value={quantity} onChange={handleChange} maxLength={5} size={5} />
        </p>
      </div>
      <div className="shelf-item__price">
        <p>{formatPrice(price, currencySymbol)}</p>
      </div>
    </div>
  );
};

CartProduct.propTypes = {
  product: PropTypes.object.isRequired,
  removeProduct: PropTypes.func.isRequired,
  currencySymbol: PropTypes.string.isRequired,
  quantityTextLabel: PropTypes.string.isRequired,
  cartProducts: PropTypes.array,
  updateCart: PropTypes.func,
  productToAdd: PropTypes.object,
  className: PropTypes.object
};

CartProduct.defaultProps = {
  product: {}
};

export default CartProduct;
