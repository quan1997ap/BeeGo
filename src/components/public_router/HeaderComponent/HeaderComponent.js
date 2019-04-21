import React, { Component } from "react";
import "./HeaderComponent.css";
import { Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import { Login } from "../../../redux/actions/checkAuthorizeAction";
import {
  createBrowserHistory,
  createHashHistory,
  createMemoryHistory
} from 'history'

const orangeColorText = {
  color: "#f57224"
};
const whiteColorText = {
  color: "#fff"
};
const greenColorText = {
  color: "#30c8dc"
};


class HeaderComponent extends Component {
  
  constructor(props) {
    super(props);
    this.state = {};
  }

  _dispatchReduxLogOut(){
    const { history, authed } = this.props;
    this.props.dispatchReduxLogOut(false);
    localStorage.removeItem("token");
    localStorage.removeItem("typeUser");
    history.push("/login");
    //console.log(this.history);
  }

  componentDidMount(){
  }

  render() {
    return (
      <div className="Header-app" id="Header">
        <div className="Reset-margin Header-app">
          <div className="Full-width Header-background-first " id="Header-menu">
            <Row className="Center Header-contact">
              <div className="Container-custom">
                <span>Chào mừng bạn đã đến với Bee Go !</span>
                <Button className={"Logout-button"}  onClick={this._dispatchReduxLogOut.bind(this)}> Logout !</Button>
                <a>
                  <i className="fab fa-twitter Icon-link" />
                </a>
                <a>
                  <i className="fab fa-facebook-f Icon-link" />
                </a>
                <a>
                  <i className="fab fa-google Icon-link" />
                </a>
              </div>
            </Row>
          </div>

          <div
            className="Full-width Header-background-Second"
            id="Search-header"
          >
            <Row className="Max-width Full-width">
              <Col xs={12} sm={6} md={3} lg={3} className="No-padding">
                <Link to="/" >
                  <img
                    alt="logo"
                    className="Logo-Beego"
                    src={require("../../../assets/image/beego.png")}
                  />
                </Link>
              </Col>
              <Col xs={12} sm={6} md={6} lg={6} className="No-padding">
                <div className="Feature-tag-search">
                  <a>Xu hướng tìm kiếm</a>
                  <a>Thời tramg</a>
                  <a>Điện tử</a>
                </div>
                <div className="Div-search">
                  <input
                    className="Height-control Input-search"
                    placeholder="Tìm kiếm trên BeeGo"
                    type="text"
                    name="name"
                  />
                  <Button className="Height-control Button-search">
                    Tìm kiếm
                  </Button>
                  <span className="Arrow-left-search" />
                </div>
              </Col>
              <Col xs={12} sm={6} md={2} lg={2}  className={ "No-padding Account "  + (this.props.listState.isLogin === true ? "Display-none" : "")} >
                <ul className="Account-info">
                  <li>
                    <Link to="/login">Đăng nhập /</Link>
                  </li>
                  <li>
                    <Link to="/signup">Đăng ký</Link>
                  </li>
                </ul>
              </Col>
              <Col xs={12} sm={6} md={1} lg={1} className="No-padding Cart">
                <div className="Top-cart-contain">
                  <div className="mini-cart text-xs-center">
                      <Link to="/list-product-of-user"  className="heading-cart">
                        <span className="cartCount count_item_pr" id="cart-total">
                          0
                        </span>
                        <span className="cart-text">Giỏ hàng</span>
                      </Link>
                  </div>
                </div>
              </Col>
              <Col xs={12} sm={6} md={2} lg={2}  className={ "No-padding Account "  + (this.props.listState.isLogin !== true ? "Display-none" : "")} >
                <Link to="/profile" className="Account-info">
                  <li> Thông tin cá nhân  </li>
                </Link>
              </Col>
            </Row>

            <div className="Max-width Full-width Menu-cover">
              <div className="Menu-inside-border-dotted"> 
                <Row className="Row-menu">
                    <Col xs={12} sm={6} md={3} lg={2}  className="No-padding Border-left-menu Border-right-menu" >
                        <Link to="/profile" className="Child-Link">Thông tin cá nhân</Link>
                    </Col>
                    <Col xs={12} sm={6} md={3} lg={2}  className="No-padding Border-right-menu" >
                        <Link to="/profile" className="Child-Link">Thông tin cá nhân</Link>
                    </Col>
                    <Col xs={12} sm={6} md={3} lg={2}  className="No-padding Border-right-menu" >
                        <Link to="/profile" className="Child-Link">Thông tin cá nhân</Link>
                    </Col>
                    <Col xs={12} sm={6} md={3} lg={2}  className="No-padding Border-right-menu" >
                        <Link to="/profile" className="Child-Link">Thông tin cá nhân</Link>
                    </Col>
                </Row>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// listState : tên đặt cho danh sách các state mà lấy ra được từ store
// state là danh sách tất cả các state => có thể lấy riêng rẽ => state.isLogin
const mapStateToProps = (state) => {
  return {
    listState: state
  }
}

// isLogin == true => đã login
const mapDispatchToProps = dispatch => {
  return {
    dispatchReduxLogOut: (isLogin) => dispatch(Login(isLogin)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HeaderComponent);