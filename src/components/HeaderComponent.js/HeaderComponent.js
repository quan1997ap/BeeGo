import React, { Component } from "react";
import "./HeaderComponent.css";
import { Row, Col, Button } from "react-bootstrap";

import { Link } from "react-router-dom";

const orangeColorText = {
  color: "#ff7f27"
};
const whiteColorText = {
  color: "#fff"
};
const greenColorText = {
  color: "#1893ae"
};

class HeaderComponent extends Component {
  render() {
    return (
      <div className="Header-app">
        <div className="Reset-margin Header-app">
          <div className="Full-width Header-background-first">
            <Row className="Center Header-one">
              <a style={orangeColorText}>Bán hàng cùng BEEGO</a>
              <a style={greenColorText}>Chăm sóc khách hàng</a>
              <a style={whiteColorText}>Kiểm tra đơn hàng</a>
              <Link to="/login" style={whiteColorText}>
                Đăng nhập
              </Link>
              <Link to="/signup" style={whiteColorText}>
                Đăng kí
              </Link>
              <Link to="/profile" style={whiteColorText}>
                Thông tin cá nhân{" "}
              </Link>
            </Row>
          </div>
          <Row className="Full-width Header-background-Second">
            <div className="Max-width Full-width">
              <Col xs={12} sm={4} md={3} lg={2}>
                <Link to="/" >
                  <img
                    className="Logo-Beego"
                    src={require("../../assets/image/beego.png")}
                  />
                </Link>
              </Col>
              <Col className="Flex-align-center" xs={12} sm={6} md={8} lg={8}>
                <form className="Full-width Form-input">
                  <input
                    className="Height-control Input-search"
                    placeholder="Tìm kiếm trên BeeGo"
                    type="text"
                    name="name"
                  />
                  <Button className="Height-control Button-search">
                    <i className="fas fa-search" />
                  </Button>
                  <Button className="Height-control Your-cart">
                    <i className="fas fa-cart-arrow-down" />
                  </Button>
                </form>
              </Col>
              <Col xs={12} sm={2} md={2} lg={2} />
            </div>
          </Row>
        </div>
      </div>
    );
  }
}

export default HeaderComponent;
