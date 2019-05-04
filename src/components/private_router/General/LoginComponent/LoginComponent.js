import React, { Component } from "react";
import "./LoginComponent.css";
import "./LoginComponentMore.css";
import { Button } from "react-bootstrap";

import {
  _validateEmail,
  _maxLength,
  _minLength
} from "../../../../configs/validates";
import { AccoutLoginModel } from "../../../../model/userinfo.model";
import {
  loginService,
  ckeckTokenService
} from "../../../../service/login-service";
import {
  setStorageService,
  getStorageService
} from "../../../../service/storeage-service";
import { BrowserRouter as Router, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { Login } from "../../../../redux/actions/checkAuthorizeAction";
import {
  ToastsContainer,
  ToastsStore,
  ToastsContainerPosition
} from "react-toasts";

class LoginComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      email: "",
      typeuser: "customer",

      passwordInputFocus: false,
      emailInputFocus: false,

      passwordInputLostFocus: false,
      emailInputLostFocus: false,

      resMessage: "",
      redirectToReferrer: false,
      showPass: false,
      componentDidMount: false,
      isFirst: true,
      from: "/"
    };
  }

  _selectTypeUser(typeUser) {
    this.setState({
      typeuser: typeUser,
      resMessage: ""
    });
  }

  _dispatchReduxLogin(isLogin) {
    this.props.dispatchReduxLogin(isLogin);
  }

  componentDidMount() {
    // lưu pathname của private => đăng nhập xong => chuyển sang
    let token = localStorage.getItem("token");
    console.log(this.props.location.state);
    if (this.props.location.state !== undefined) {
      this.setState({
        from: { pathname: `${this.props.location.state.detail}` }
      });
    } else {
      this.setState({ from: { pathname: "/" } });
    }

    if (token !== null && token !== "token invalid") {
      ckeckTokenService(token).then(statusToken => {
        if (statusToken.status === 200) {
          this._dispatchReduxLogin(true);
          this.setState({ redirectToReferrer: true });
        }
      });
    } else {
      this.setState({ redirectToReferrer: false });
      this._dispatchReduxLogin(false);
    }
  }

  _loginWithUserAccount(pass, email, type) {
    let userAccount = new AccoutLoginModel();
    userAccount.password = pass;
    userAccount.type = type;
    userAccount.email = email;
    loginService(userAccount).then(resLogin => {
      console.log(resLogin);
      if (resLogin !== undefined && resLogin.data.result === false) {
        this.setState({ resMessage: resLogin.data.message });
      } else if (resLogin.data.result === true) {
        setStorageService("typeUser", userAccount.type);
        setStorageService("token", resLogin.data.token).then(() => {
          this._dispatchReduxLogin(true);
          ToastsStore.success("Thêm category thành công");
          this.setState({ redirectToReferrer: true });
        });
      }
    }).catch(
      (errLogin) => {
        console.log(errLogin);
        ToastsStore.error("Có lỗi xảy ra, hãy đăng nhập lại !");
      } 
    )
  }

  render() {
    const { redirectToReferrer, from } = this.state;

    if (true === redirectToReferrer) {
      return <Redirect to={from} />;
    } else if (false === redirectToReferrer) {
      return (
        <div className="SignIn-component">
          <ToastsContainer
            store={ToastsStore}
            position={ToastsContainerPosition.TOP_RIGHT}
          />
          <div className="limiter Background-login">
            <div className="container-login100 Background-form-login">
              <div className="wrap-login100 p-l-50 p-r-50 p-t-62 p-b-33 Scaledow-form-login">
                <form className="login100-form validate-form flex-sb flex-w">
                  <span className="login100-form-title p-b-15">Đăng nhập</span>

                  {/* email */}
                  <div className="p-t-13 p-b-9">
                    <span className="txt1">Email</span>
                  </div>
                  <div className="wrap-input100 validate-input">
                    <input
                      className="input100 fs-25"
                      type="email"
                      name="email"
                      onChange={email => {
                        this.setState({
                          email: email.target.value,
                          resMessage: ""
                        });
                      }}
                      onBlur={() => {
                        this.setState({ emailInputLostFocus: true });
                      }}
                      onFocus={() => {
                        this.setState({ emailInputFocus: true });
                      }}
                    />
                    <div
                      className={
                        "Input-invalid " +
                        (this.state.emailInputLostFocus === true &&
                        this.state.emailInputFocus === true &&
                        _validateEmail(this.state.email) === false
                          ? "Display-block"
                          : "Display-none")
                      }
                    >
                      Bạn phải nhập đúng định dạng Email( VD: @gmail.com )
                    </div>
                    <span className="focus-input100" />
                  </div>

                  {/* password */}
                  <div className="p-t-13 p-b-9">
                    <span className="txt1">Mật khẩu</span>

                    <a href="/" className="txt2 bo1 m-l-5">
                      Forgot?
                    </a>
                  </div>
                  <div className="wrap-input100 validate-input">
                    <input
                      className="input100 fs-25"
                      type="password"
                      name="password"
                      onChange={password => {
                        this.setState({
                          password: password.target.value,
                          resMessage: ""
                        });
                      }}
                      onBlur={() => {
                        this.setState({ passwordInputLostFocus: true });
                      }}
                      onFocus={() => {
                        this.setState({ passwordInputFocus: true });
                      }}
                    />
                    <div
                      className={
                        "Input-invalid " +
                        (this.state.passwordInputLostFocus === true &&
                        this.state.passwordInputFocus === true &&
                        _maxLength(30, this.state.password) === false &&
                        _minLength(4, this.state.password) === false
                          ? "Display-block"
                          : "Display-none")
                      }
                    >
                      Bạn phải nhập mật khẩu tối thiểu 4 kí tự và tối đa 30 kí
                      tự
                    </div>
                    <span className="focus-input100" />
                  </div>

                  <div className="p-t-13 p-b-9">
                    <span className="txt1">Loại tài khoản</span>
                  </div>
                  <div className="wrap-input100 Switch-type-user">
                    <Button
                      className={
                        "btn-type-user-login m-b-20 " +
                        (this.state.typeuser === "customer" ? "Active-bg" : "")
                      }
                      onClick={this._selectTypeUser.bind(this, "customer")}
                    >
                      Người dùng
                    </Button>
                    <Button
                      className={
                        "btn-type-user-login m-b-20 " +
                        (this.state.typeuser === "provider" ? "Active-bg" : "")
                      }
                      onClick={this._selectTypeUser.bind(this, "provider")}
                    >
                      Người bán
                    </Button>

                    <Button
                      className={
                        "btn-type-user-login m-b-20 " +
                        (this.state.typeuser === "admin" ? "Active-bg" : "")
                      }
                      onClick={this._selectTypeUser.bind(this, "admin")}
                    >
                      Admin
                    </Button>
                  </div>

                  {/* dang ki that bai */}
                  <div className="p-t-13 p-b-9">
                    <span className="txt1 Input-invalid">
                      {this.state.resMessage}
                    </span>
                  </div>

                  <div className="container-login100-form-btn m-t-17">
                    <Button
                      onClick={this._loginWithUserAccount.bind(
                        this,
                        this.state.password,
                        this.state.email,
                        this.state.typeuser
                      )}
                      className={
                        "login100-form-btn " +
                        (this.state.password === "" ||
                        this.state.email === "" ||
                        _validateEmail(this.state.email) === false
                          ? "Opacity-disable"
                          : "btn-type-user-login-form-valid")
                      }
                      disabled={
                        this.state.password === "" ||
                        this.state.email === "" ||
                        _validateEmail(this.state.email) === false
                          ? true
                          : false
                      }
                    >
                      Đăng nhập
                    </Button>
                    <span className="focus-input100" />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = state => {
  return {
    listState: state
  };
};

// isLogin == true => đã login // false => chưa login
const mapDispatchToProps = dispatch => {
  return {
    dispatchReduxLogin: isLogin => dispatch(Login(isLogin))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginComponent);

// history.js:404 Throttling navigation to prevent the browser from hanging. See https://crbug.com/882238. Command line switch --disable-ipc-flooding-protection can be used to bypass the protection
