import React, { Component } from "react";
import PropTypes from "prop-types";

import Thumb from "./Thumb";
import { formatPrice } from "../../helpers";
import {updateCart, loadCart, removeProduct} from "../../actions";
import { connect } from "react-redux";
import storage from "../../storage";
import {Cart} from "./index";

class CartProduct extends Component {
  static propTypes = {
    product: PropTypes.object.isRequired,
    removeProduct: PropTypes.func.isRequired,
    currencySymbol: PropTypes.string.isRequired,
    quantityTextLabel: PropTypes.string.isRequired,
    cartProducts: PropTypes.array,
    updateCart: PropTypes.func,
    productToAdd: PropTypes.object
  };

  state = {
    isMouseOver: false,
    quantity: this.props.product.quantity,
    price: this.props.product.price
  };

  componentWillReceiveProps(nextProps) {
    const {quantity, price} = this.props.product;
    this.setState({quantity: quantity, price: price});
  };

  handleMouseOver = () => {
    this.setState({ isMouseOver: true });
  };

  handleMouseOut = () => {
    this.setState({ isMouseOver: false });
  };

  handleChange(event) {
    const {value} = event.target;
    const {price} = this.props.product;
    const {cartProducts} = this.props;

    const regex = /^[0-9\b]+$/;
    if (value === '' || regex.test(value)) {
      this.setState({quantity: value, price: price * value});

      cartProducts && cartProducts.forEach(cp => {
        if (cp.id === this.props.product.id) {
          cp.quantity = parseInt(value);
        }
      });

      this.props.updateCart(cartProducts);
    }
  }

  render() {
    const {
      product,
      removeProduct,
      currencySymbol,
      quantityTextLabel
    } = this.props;
    const classes = ["shelf-item"];

    if (!!this.state.isMouseOver) {
      classes.push("shelf-item--mouseover");
    }

    return (
      <div className={classes.join(" ")}>
        <div
          className="shelf-item__del"
          onMouseOver={() => this.handleMouseOver()}
          onMouseOut={() => this.handleMouseOut()}
          onClick={() => removeProduct(product)}
        />
        <Thumb
          classes="shelf-item__thumb"
          src={product.image || "https://via.placeholder.com/150"}
          alt={product.name}
        />
        <div className="shelf-item__details">
          <p className="title">{product.name}</p>
          <p className="desc">
            {quantityTextLabel}: <input type="text" name="quantity" value={this.state.quantity}
                                        onChange={this.handleChange.bind(this)} maxLength={5} size={5} />
          </p>
        </div>
        <div className="shelf-item__price">
          <p>{formatPrice(this.state.price, currencySymbol)}</p>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    cartProducts: state.cart.products,
    productToAdd: state.cart.productToAdd
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateCart: products => dispatch(updateCart(products))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CartProduct);
