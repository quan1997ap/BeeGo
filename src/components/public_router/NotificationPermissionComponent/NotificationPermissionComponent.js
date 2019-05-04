import React, { Component } from "react";
import "./NotificationPermissionComponent.css";
import { Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import { Login } from "../../../redux/actions/checkAuthorizeAction";
import { withRouter } from 'react-router-dom';

class _NotificationPermissionComponent extends Component {
  
  constructor(props) {
    super(props);
    this.state = {};
  }

  _SwitchRedirect(pageRidirectName){
    const { history } = this.props;
    if (pageRidirectName === "Home"){
      this.props.dispatchReduxLogOut(false);
      localStorage.removeItem("token");
      localStorage.removeItem("typeUser");
      history.push("/");
    }
    else if (pageRidirectName === "Login"){
      history.push("/");
    }
  }

  render() {
    return (
      <div className="Header-app" id="Header">
        <div className="Reset-margin Header-app">
          <div className="Full-width Header-background-first " id="Header-menu">
            <Row className="Center Header-contact">
              <div className="Container-custom">
                <h2>Bạn không có quyền truy cập vào trang web này </h2>
                <Button className={"Logout-button"}  onClick={this._dispatchReduxLogOut.bind(this, "Home")}>Trở về trang chủ !</Button>
                <Button className={"Logout-button"}  onClick={this._dispatchReduxLogOut.bind(this, "Login")}>Đăng nhập lại !</Button>
              </div>
            </Row>
          </div>
        </div>
      </div>
    );
  }
}

// listState : tên đặt cho danh sách các state mà lấy ra được từ store
// state là danh sách tất cả các state => có thể lấy riêng rẽ => state.isLogin

const  NotificationPermissionComponent =  withRouter(_NotificationPermissionComponent);

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

export default connect(mapStateToProps, mapDispatchToProps)(NotificationPermissionComponent);