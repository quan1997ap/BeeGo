import React, { Component } from "react";
import "./Cart.css";
// import { Button } from 'react-bootstrap';

import { getCartItems, deleteItemInCart, getPayments, payBill } from '../../../../service/cart-service';
import Dropdown from 'react-dropdown';

class Cart extends Component {

  state = {
    cartItems: [],
    totalPrice: 0,
    paymentList: [],
    paymentName: [],
    paymentWay: '',
  }


  componentDidMount() {
    this.getCartAllItems();
    getPayments()
      .then(data => {
        let paymentName = [];
        let a = data.data.map(payment => paymentName.push(payment.name))
        this.setState({ paymentList: data.data, paymentName }, () => console.log('payment name: ', this.state.paymentName))
      })
      .catch(error => console.log(error))
  }

  getCartAllItems = () => {
    getCartItems()
      .then(data => {
        this.setState({ cartItems: data.data.products }, () => this.countTotalPrice())
      })
      .catch(error => console.log(error))
  }

  handleCheck = () => {

  }

  paymentRender() {
    let payments = this.state.paymentList.map((item, index) => {
      return <div>
        <input type="checkbox" onChange={this.handleCheck} defaultChecked={this.state.checked} />
        {item.name}
      </div>
    })
    return payments;
  }

  countTotalPrice() {
    let price = 0;
    let data = this.state.cartItems.map((item, index) => {
      price = item.price * item.quantity + price;
      return item;
    });
    this.setState({ totalPrice: price })
  }

  subQuantity = (itemId) => {
    let items = this.state.cartItems.map((item, index) => {
      if (item._id === itemId) {
        if (item.quantity > 1) {
          item.quantity = item.quantity - 1;
        }
        return item;
      }
    })
    this.setState({ cartItems: items }, () => this.countTotalPrice());
  }
  incQuantity = (itemId) => {
    let items = this.state.cartItems.map((item, index) => {
      if (item._id === itemId) {
        item.quantity = item.quantity + 1;
      }
      return item;
    })
    this.setState({ cartItems: items }, () => this.countTotalPrice());
  }

  deleteItem = (itemId) => {
    let list = {
      products: [itemId]
    }
    deleteItemInCart(list)
      .then(data => {
        console.log(data);
        this.getCartAllItems();
      })
      .catch(error => console.log(error))
  }

  selectPayment = (e) => {
    let data = this.state.paymentList.filter(payment => payment.name = e.value);
    if (data.length > 0) {
      this.setState({ paymentWay: data[0]._id }, () => console.log(this.state.paymentWay));
    }
    else alert('ko chon dc')
  }

  pay(item) {
    let payload = {
      productId: item._id,
      paymentId: this.state.paymentWay,
      discountId: '',
      quantity: item.quantity,
      providerId: item.providerId
    }
    payBill(item)
    .then(data => {
      console.log('da tra tien', data);
    })
    .catch(error => console.log(error))
  }

  renderCartItems() {
    console.log(this.state.cartItems);
    let data = this.state.cartItems.map((item, index) =>
      <div className="cart-item" key={index}>
        <div className="item-name">
          {item.description}
        </div>
        <div className="item-price">
          {item.price}
        </div>
        <div className="item-quantity">
          <button onClick={() => this.subQuantity(item._id)}>-</button>
          {item.quantity}
          <button onClick={() => this.incQuantity(item._id)}>+</button>
        </div>
        <div>
          <button onClick={() => this.deleteItem(item._id)}>Xóa sp</button>
        </div>
        <div>
          {this.state.paymentList ? <Dropdown options={this.state.paymentName} defaultOption={this.state.paymentName[0]} onChange={this.selectPayment} placeholder="Select an option" /> : null}
          <button onClick={() => this.pay(item)}>Thanh toán</button>
        </div>
        <div>
          Tổng tiền: {this.state.totalPrice}
        </div>

      </div >
    )
    return data;
  }


  render() {
    return (
      <div className="container-custom">
        <div className="user-card">
          <p className="cart-name">GIỎ HÀNG CỦA BẠN</p>
          {this.state.cartItems ? this.renderCartItems() : "mua sắm ngay bây giờ"}
        </div>
      </div>
    )

  }
}
export default Cart;
