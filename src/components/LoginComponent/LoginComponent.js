import React, { Component } from "react";
import "./LoginComponent.css";
import "./LoginComponentMore.css";
import { Button } from "react-bootstrap";

import {
  _validateEmail,
  _maxLength,
  _minLength
} from "../../configs/validates";
import { AccoutLoginModel } from "../../model/userinfo.model";
import { LoginService } from "../../service/login-service";
import { setStorageService } from "../../service/storeage-service";
import { BrowserRouter as Router, Redirect } from "react-router-dom";
import { connect } from 'react-redux';
import { Login } from "../../redux/actions/checkAuthorizeAction";

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
      componentDidMount: false
    };
  }

  _selectTypeUser(typeUser) {
    this.setState({
      typeuser: typeUser,
      resMessage: ""
    });
  }

  _dispatchReduxLogin(){
    this.props.dispatchReduxLogin(true);
  }

  componentDidMount() {
    setTimeout( () => {
      if (this.props.listState.isLogin === true){
         this.setState({ redirectToReferrer: true})
        //console.log(this.props.listState.isLogin === true)
      }
    }, 1000)
  }

  _loginWithUserAccount(pass, email, type) {
    let userAccount = new AccoutLoginModel();
    userAccount.password = pass;
    userAccount.type = type;
    userAccount.email = email;
    LoginService(userAccount).then(resLogin => {
      console.log(resLogin);
      if (resLogin !== undefined && resLogin.data.result === false) {
        this.setState({ resMessage: resLogin.data.message });
      } else if (resLogin.data.result === true) {
        setStorageService("typeUser", userAccount.type);
        setStorageService("token", resLogin.data.token).then(() => {
          this._dispatchReduxLogin();
          this.setState({ redirectToReferrer: true});
        });
      }
    });
  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: "/" } };
    const { redirectToReferrer } = this.state;

    if (redirectToReferrer) {
      return <Redirect to={from} />;
    }

    return (
      <div className="SignIn-component">
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
                  {/* <FontAwesomeIcon icon="stroopwafel" /> */}
                  {/* <Button onClick = { this.setState({showPass : true })} className={"Btn-show-hide-pass" + (this.state.showPass === true ? 'Display-inline' : 'Display-none')} > <i class="fas fa-eye"> </i></Button>
                  <Button onClick = { this.setState({showPass : false })} className={"Btn-show-hide-pass" + (this.state.showPass !== true ? 'Display-inline' : 'Display-none')} > <i class="fas fa-eye-slash"> </i></Button> */}
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
                    Bạn phải nhập mật khẩu tối thiểu 4 kí tự và tối đa 30 kí tự
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
                      (this.state.password === "" ||
                      this.state.email === "" ||
                      _validateEmail(this.state.email) === false)
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


const mapStateToProps = (state) => {
  return {
    listState: state
  }
}

// isLogin == true => đã login // false => chưa login
const mapDispatchToProps = dispatch => {
  return {
    dispatchReduxLogin: (isLogin) => dispatch(Login(isLogin)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginComponent);

// history.js:404 Throttling navigation to prevent the browser from hanging. See https://crbug.com/882238. Command line switch --disable-ipc-flooding-protection can be used to bypass the protection
