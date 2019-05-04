import React, { Component } from "react";
import { connect } from "react-redux";
import LoadingComponent from "../../components/public_router/LoadingComponent/LoadingComponent";
import { Route, Redirect, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import {  } from "../../service/storeage-service";
import { ckeckTokenService } from "../../service/login-service";
import NotificationPermissionComponent from "../../components/public_router/NotificationPermissionComponent/NotificationPermissionComponent";

class PrivateRoute extends Component {
  constructor(props) {
    super(props);
    this.state = {
      haveAcces: false,
      loaded: false
    };
  }

  componentWillMount() {
    this.checkAcces();
  }

  checkAcces = () => {
    const { history, authed, roleUser } = this.props;
    let tokenInLocalStorage = localStorage.getItem("token");
    // ĐÃ ĐĂNG NHẬP VÀ CÓ TOKEN
    ckeckTokenService(tokenInLocalStorage).then(resCheckToken => {
       //console.log(resCheckToken );
      if (roleUser === resCheckToken.data.role &&  'live' === resCheckToken.data.status ){
        // TOKEN  ĐÚNG VÀ QUYỀN ĐÚNG => BỎ LOADING =>CHO VÀO TRANG PRIVATE
        this.setState({loaded: true, haveAcces : true}, () => {
          history.push(`${this.props.path}`);
        })
      }
      else{
        console.log('k oke');
        // TOKEN  ĐÚNG VÀ QUYỀN KHÔNG ĐÚNG => BỎ LOADING => CHO VÀO TRANG THÔNG BÁO => TRANG THÔNG BÁO SẼ QUYẾT ĐỊNH CÓ CHO ĐĂNG NHẬP TIẾP HAY TRỞ VỀ TRANG TRƯỚC
        this.setState({loaded: true, haveAcces : false}, () => {
          history.push({
            pathname: "/login",
            state: { detail: this.props.path }
          });
        })
      }
        
      })
    .catch((error) => {
      // CHƯA ĐĂNG NHẬP => BẮT ĐĂNG NHẬP
      // 404: Not found - không tìm thấy
      // 401: Unauthorized - Không có quyền
      // 403: Forbidden - Bị cấm truy nhập:
        const errCode = parseInt(error.response && error.response.status);
        if (errCode === 403){
          this.setState({
            loaded: true,
            haveAcces : false
          },() => {
            // token không  đúng 
            history.push({
              pathname: "/login",
              state: { detail: this.props.path }
            });
          })
        }
    });
  }

  render() {
    const { component: Component, ...rest } = this.props;
    const { loaded, haveAcces } = this.state;
    return loaded === true ? (
      <Route
        {...rest}
        render={props => {
          return haveAcces === true ? (
            <Route path={this.props.path} component={this.props.component} />
          ) : (
            // <Redirect
            //   to={{ pathname: "/login", state: { from: props.location } }}
            // />
            <Route component={LoadingComponent} />
          );
        }}
      />
    ) : (
      <Route component={LoadingComponent} />
    );
  }
}

export default withRouter(PrivateRoute);

// PrivateRoute.propTypes = {
//   userRole: PropTypes.string.isRequired,
// };
