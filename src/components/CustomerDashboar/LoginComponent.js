import React, { Component } from "react";
import "./LoginComponent.css";
import "./LoginComponentMore.css";

class LoginComponent extends Component {
  render() {
    return (
      <div className="Login-component">
        <div className="limiter">
          <div
            className="container-login100 Background-login"
          >
            <div className="wrap-login100 p-l-50 p-r-50 p-t-62 p-b-33 Scaledow-form-login">
              <form className="login100-form validate-form flex-sb flex-w">
                <span className="login100-form-title p-b-53">Đăng nhập</span>

                <a href="#" className="btn-face m-b-20">
                 <i class="fab fa-facebook"></i>
                  Facebook
                </a>

                <a href="#" className="btn-google m-b-20">
                  <img src={require("../../assets/image/icon/icon-google.png")} alt="GOOGLE" />
                  Google
                </a>

                <div className="p-t-31 p-b-9">
                  <span className="txt1">Tài khoản</span>
                </div>
                <div
                  className="wrap-input100 validate-input"
                  data-validate="Username is required"
                >
                  <input className="input100" type="text" name="username" />
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
                  <input className="input100" type="password" name="pass" />
                  <span className="focus-input100" />
                </div>

                <div className="container-login100-form-btn m-t-17">
                  <button className="login100-form-btn">Đăng nhập</button>
                </div>

                <div className="w-full text-center p-t-55">
                  <span className="txt2">Not a member? </span>

                  <a href="#" className="txt2 bo1">
                    Sign up now
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LoginComponent;
