import React, { Component } from "react"
import PropTypes from "prop-types";
import "./styles.css";
import {addProduct} from "../../actions/cart";
import {useDispatch} from "react-redux";

const AddCartButton = (props) => {

  const dispatch = useDispatch();

  const addProductToCart = (event, product) => {
    product.quantity = 1;
    dispatch(addProduct(product));
  };

  const { product, styles, addLabel } = props;

  return (
    <div>
      <button
        style={{ ...styles }}
        onClick={event => addProductToCart(event, product)}
      >
        { addLabel }
      </button>
    </div>
  );
};

AddCartButton.propTypes = {
  product: PropTypes.object.isRequired,
  styles: PropTypes.object,
  addLabel: PropTypes.string
};

AddCartButton.defaultProps = {
  ddLabel: "Add to Cart"
};

export default AddCartButton;
