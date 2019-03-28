import React, { Component } from "react";
import "./SignUpComponent.css";
import "./SignUpComponentMore.css";
import { Button } from "react-bootstrap";

class SignUpComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      typeuser: "customer"
    };
    // this.handleClick = this.handleClick.bind(this);
  }

  _selectTypeUser(typeUser){
    this.setState({
      typeuser: typeUser
    });
  }

  render() {
    return (
      <div className="SignIn-component">
        <div className="limiter">
          <div className="container-login100 Background-login">
            <div className="wrap-login100 p-l-50 p-r-50 p-t-62 p-b-33 Scaledow-form-login">
              <form className="login100-form validate-form flex-sb flex-w">
                <span className="login100-form-title p-b-53">Đăng kí</span>

                <a href="#" className="btn-face m-b-20">
                  <i class="fab fa-facebook" />
                  Facebook
                </a>

                <a href="#" className="btn-google m-b-20">
                  <img
                    src={require("../../assets/image/icon/icon-google.png")}
                    alt="GOOGLE"
                  />
                  Google
                </a>

                <div className="p-t-31 p-b-9">
                  <span className="txt1">Tài khoản</span>
                </div>
                <div
                  className="wrap-input100 validate-input"
                  data-validate="Username is required"
                >
                  <input
                    className="input100"
                    type="text"
                    name="username"
                    onChange={typeuser => {
                      this.setState({
                        typeuser: typeuser.target.value.length > 0
                      });
                    }}
                  />
                  <span className="focus-input100" />
                </div>

                <div className="p-t-13 p-b-9">
                  <span className="txt1">Mật khẩu</span>

                  <a href="#" className="txt2 bo1 m-l-5">
                    Forgot?
                  </a>
                </div>
                <div
                  className="wrap-input100 validate-input"
                  data-validate="Password is required"
                >
                  <input
                    className="input100"
                    type="password"
                    name="pass"
                    onChange={password => {
                      this.setState({
                        password: password.target.value.length > 0
                      });
                    }}
                  />
                  <span className="focus-input100" />
                </div>

                <div className="p-t-13 p-b-9">
                  <span className="txt1">Loại tài khoản</span>
                </div>
                <div className="wrap-input100 Switch-type-user">
                  <Button className={"btn-type-user m-b-20 " + (this.state.typeuser === "customer" ? 'Active-bg' : '')} onClick = { this._selectTypeUser.bind(this,"customer") } >Người dùng</Button>
                  <Button className={"btn-type-user m-b-20 " + (this.state.typeuser !== "customer" ? 'Active-bg' : '')} onClick = {this._selectTypeUser.bind(this,"provider")} >Người bán</Button>
                </div>

                <div className="container-login100-form-btn m-t-17">
                  <button className="login100-form-btn">Đăng nhập</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SignUpComponent;
