import React, { Component } from "react";
import "./Cart.css";
import {
  getCartItems,
  deleteItemInCart,
  getPayments,
  payBill
} from "../../../../service/cart-service";
import {
  getAllOrderForCustomer,
  orderSuccess,
  getCustomerInfo
} from "../../../../service/customer-service";
import { _formatCurrency, getStatus } from "../../../../configs/format";
import { Row, Col, Button, Table, Modal, Dialog } from "react-bootstrap";
import Spinner from "react-spinner-material";


class Cart extends Component {
  state = {
    cartItems: [],
    totalPrice: 0,
    paymentList: [],
    paymentName: [],
    paymentWay: "",
    discountId: "",
    orders: [],
    userInfo: {},
    userInfoWithout: false,
    showModal: false,
    isLoading: true,
    comment: "",
    currentOrder: {}
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    this.getCartAllItems();

    getPayments()
      .then(data => {
        let paymentName = [];
        let a = data.data.map(payment => paymentName.push(payment.name));
        this.setState({ paymentList: data.data, paymentName });
      })
      .catch(error => console.log(error));
    getAllOrderForCustomer().then(resAllOrder => {
      if (resAllOrder.data !== undefined) {
        this.setState({ orders: resAllOrder.data }, () => {
          // console.log(this.state.orders);
        });
      }
    });

    getCustomerInfo().then(resUserInfo => {
      if (
        resUserInfo.data.info.name === "" ||
        resUserInfo.data.info.address === "" ||
        resUserInfo.data.info.phone === "" ||
        resUserInfo.data.email === ""
      ) {
        this.setState({ userInfoWithout: true });
      } else {
        let userInfo = Object.assign({});
        userInfo.email = resUserInfo.data.email;
        userInfo.name = resUserInfo.data.info.name;
        userInfo.address = resUserInfo.data.info.address;
        userInfo.phone = resUserInfo.data.info.phone;
        this.setState({ userInfoWithout: false, userInfo: userInfo }, () => {
          console.log(this.state.userInfo);
        });
      }
    });
  }


  ordersRender() {
    let orderList;
    orderList = this.state.orders.map((order, indexOrder) =>
      order.orderDetails.map(orderDetail => (
        <table className="table  border-table" key={indexOrder}>
          <tbody className = {order.status}>
            <tr className="title-tab td-title">
              <td>Đơn hàng số {indexOrder}</td>
              <td className="text-center">Trạng thái : {getStatus(order.status)}</td>
            </tr>
            <tr>
              <td>Tên mặt hàng</td>
              <td>
                {orderDetail.product.name ? orderDetail.product.name : "-"}
              </td>
            </tr>
            <tr>
              <td>Mô tả mặt hàng</td>
              <td>
                {orderDetail.product.description
                  ? orderDetail.product.description
                  : "-"}
              </td>
            </tr>
            <tr>
              <td>Giá mặt hàng</td>
              <td>
                {orderDetail.product.price
                  ? _formatCurrency(orderDetail.product.price)
                  : "-"}
              </td>
            </tr>
            <tr>
              <td>Xác nhận đã nhận hàng</td>
              <td>
                <Button className = {order.status === 2 ? "" : "d-none"}  onClick={() => this._handleOpenModal(order)}>
                  Xác nhận
                </Button>{" "}
              </td>
            </tr>
          </tbody>
        </table>
      ))
    );
    return orderList;
  }

  getCartAllItems = () => {
    getCartItems()
      .then(data => {
        let products = Object.assign([], data.data.products);
        products.forEach(product => {
          product.quantity = 1;
        });
        this.setState({ cartItems: products }, () => this.countTotalPrice());
      })
      .catch(error => console.log(error));
  };

  paymentRender() {
    let payments = this.state.paymentList.map((item, index) => {
      return (
        <option key={index} value={item._id}>
          {item.name}
        </option>
      );
    });
    return payments;
  }

  countTotalPrice() {
    let price = 0;
    let data = this.state.cartItems.map((item, index) => {
      price = item.price * item.quantity + price;
      return item;
    });
    this.setState({ totalPrice: price });
  }

  subQuantity = itemId => {
    let items = this.state.cartItems.map((item, index) => {
      if (item._id === itemId) {
        if (item.quantity > 1) {
          item.quantity = item.quantity - 1;
        }
        return item;
      }
    });
    this.setState({ cartItems: items }, () => this.countTotalPrice());
  };

  incQuantity = itemId => {
    let items = this.state.cartItems.map((item, index) => {
      if (item._id === itemId) {
        item.quantity = item.quantity + 1;
      }
      return item;
    });
    this.setState({ cartItems: items }, () => this.countTotalPrice());
  };

  deleteItem = itemId => {
    let list = {
      products: [itemId]
    };
    deleteItemInCart(list)
      .then(data => {
        this.getCartAllItems();
      })
      .catch(error => console.log(error));
  };

  selectPayment = e => {
    let data = this.state.paymentList.filter(
      payment => (payment.name = e.value)
    );
    if (data.length > 0) {
      this.setState({ paymentWay: data[0]._id });
    } else alert("ko chon dc");
  };

  _formatCurrency(n) {
    var separate = ".";
    var s = n.toString();
    var regex = /\B(?=(\d{3})+(?!\d))/g;
    var ret = s.replace(regex, separate);
    return ret;
  }

  pay(item) {
    let payload = {
      productId: item._id,
      paymentId:
        this.state.paymentWay === ""
          ? this.state.paymentList[0]._id
          : this.state.paymentWay,
      quantity: item.quantity,
      providerId: item.providerId
    };
    if (this.state.discountId) {
      payload.discountId = this.state.discountId;
    }

    payBill(payload)
      .then(data => {
        this.deleteItem(item._id);
      })
      .catch(error => console.log(error));
  }

  renderCartItems() {
    let data = this.state.cartItems.map((item, index) => (
      <div className="cart-item" key={index}>
        <div className="item-name width-200px">{item.description}</div>
        <div className="item-price width-100px">
          {this._formatCurrency(item.price)} đ
        </div>
        <div className="item-quantity">
          <button
            onClick={() => this.subQuantity(item._id)}
            className="sub-btn"
          >
            -
          </button>
          <span>{item.quantity}</span>
          <button
            onClick={() => this.incQuantity(item._id)}
            className="add-btn"
          >
            +
          </button>
        </div>
        <button
          onClick={() => this.deleteItem(item._id)}
          className="delete-btn"
        >
          Xóa
        </button>
        {this.state.paymentList ? (
          <select
            onChange={e => this.setState({ paymentWay: e.target.value })}
            className="border-none"
          >
            {this.paymentRender()}
          </select>
        ) : null}
        <button onClick={() => this.pay(item)} className="boder-check-out-btn">
          Thanh toán
        </button>
      </div>
    ));
    return data;
  }

  _handleCloseModal() {
    this.setState({
      showModal: false,
      isLoading: false,
    });
    let acceptInfo = Object.create({});
    acceptInfo.orderId = this.state.currentOrder._id;
    acceptInfo.comment = this.state.comment;
    acceptInfo.name = this.state.userInfo.name;
    acceptInfo.email = this.state.userInfo.email;
    acceptInfo.address = this.state.userInfo.address;
    acceptInfo.phone = this.state.userInfo.phone;
    console.log(acceptInfo)
  }

  _handleOpenModal = (order) => {
    this.setState({
      showModal: true,
      isLoading: false,
      currentOrder : order
    });
  }

  render() {
    return (
      <div className="container-custom">
        <Modal
          show={this.state.showModal}
          onHide={this._handleCloseModal.bind(this)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Bạn chắc mình nhận được hàng rồi chứ</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h5>Thêm nhận xét</h5> <br/>
            <input type= "text" className="input-style" onChange = {e => this.setState({comment : e.target.value}) } />
          </Modal.Body>
          <Modal.Footer className="position-relative">
            <div
              className={
                "Modal-footer-loadding " +
                (this.state.isLoading === true ? "" : "Display-none")
              }
            >
              <Spinner
                size={20}
                spinnerColor={"#4CAF50"}
                spinnerWidth={4}
                visible={true}
              />
              <p> loading ...</p>
            </div>
            <Button
              variant="primary"
            >
              Xác nhận
            </Button>
          </Modal.Footer>
        </Modal>
        <p className="cart-name">GIỎ HÀNG CỦA BẠN</p>
        <div className="user-card d-flex">
          {this.state.cartItems
            ? this.renderCartItems()
            : "mua sắm ngay bây giờ"}
        </div>
        <hr />
        <div className="sum-cost">
          Tổng tiền: {this._formatCurrency(this.state.totalPrice)} đ
        </div>
        <hr />

        <p className="cart-name">ĐƠN HÀNG CỦA BẠN</p>
        {this.ordersRender()}
      </div>
    );
  }
}
export default Cart;
