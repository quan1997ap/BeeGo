import React, { Component } from "react";
import "./AppContainer.css";
import {
  createBrowserHistory,
  createHashHistory,
  createMemoryHistory
} from 'history'

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";

import { getStorageService } from "../../service/storeage-service";
import { ckeckTokenService } from "../../service/login-service";

import { createStore } from "redux";
import { Provider } from "react-redux";
import rootReducer from "../../redux/reducers/rootReduces";
import { Login } from "../../redux/actions/checkAuthorizeAction";
import { Button } from "react-bootstrap";

import ProfileComponent from "../../components/private_router/General/ProfileComponent/ProfileComponent";
import HeaderComponent from "../../components/public_router/HeaderComponent/HeaderComponent";
import LoginComponent from "../../components/private_router/General/LoginComponent/LoginComponent";
import SignUpComponent from "../../components/private_router/General/SignUpComponent/SignUpComponent";
import NoMatchComponent from "../../components/public_router/NoMatchComponent/NoMatchComponent";
import HomeComponent from "../../components/public_router/HomeComponent/HomeComponent";
import ListProductOfUserComponent from "../../components/private_router/Customer/ListProductOfUserComponent/ListProductOfUserComponent";
import PrivateRoute from "./PrivateRoute";

// Create store
const store = createStore(rootReducer);

// /* PrivateRoute component definition */
// const PrivateRoute = ({ component: Component, ...rest }) => {

//   if (
//     authed === undefined
//   ){
//     return(<LoadingComponent auth= {authed} />)
//   }
//   else{
//     return (
//       <Route
//         {...rest}
//         render={props =>
//          {
//           if (authed === true) {return  <Component {...props} /> }
//           else if (authed === false) { return  <Redirect to={{ pathname: "/login", state: { from: props.location } }}  />}
//          }
//         }
//       />
//     );
//   }
// };

// appContainer => 1 pageForm
// khi mới vào app => check isAuthenticated để đưa vào trong private Router như 1 prop => xác định có cho router đến k

class AppContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: undefined,
      label: "lable"
    };
  }

  componentDidMount() {
    window.addEventListener("scroll", this._handleScroll);
    // check token dang nhap
    getStorageService("token").then(token => {
      if (token !== null && token !== "token invalid") {
        ckeckTokenService(token).then(statusToken => {
          if (statusToken.status === 200) {
            store.dispatch(Login(true));
            this.setState({ label: "true" });
            this.setState({ isAuthenticated: true });
          }
        });
      } else {
        this.setState({ label: "false" });
        store.dispatch(Login(false));
        this.setState({ isAuthenticated: false }, () => {
          console.log(this.state.isAuthenticated);
        });
      }
    });
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  _handleScroll(event) {
    let Header = document.getElementById("Header");
    let wrapRouter = document.getElementById("Wrap-router");
    let searchHeader = document.getElementById("Search-header");
    let headerMenu = document.getElementById("Header-menu");

    let positionScrollBar = window.scrollY;

    if (positionScrollBar < 25) {
      wrapRouter.style.marginTop = 0;
      Header.classList.remove("Position-fixed");
      searchHeader.classList.remove("Style-search-header");
      headerMenu.classList.remove("Style-menu-header");
    } else {
      wrapRouter.style.marginTop = "90px";
      Header.classList.add("Position-fixed");
      searchHeader.classList.add("Style-search-header");
      headerMenu.classList.add("Style-menu-header");
    }
  }

  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App-container">
            <HeaderComponent />
            {/* chú ý private router => nếu pass props thông thường (auth = {isAuthenticated}) => không nhận dc
                https://tylermcginnis.com/react-router-pass-props-to-components/  */}
            <div id="Wrap-router">
              <Switch>
                <Route history={createBrowserHistory} path="/" exact component={HomeComponent} />
                <Route path="/signup" exact component={SignUpComponent} />
                <Route path="/login" exact component={LoginComponent} />
                <PrivateRoute
                  path="/list-product-of-user"
                  exact
                  authed={store.getState().isLogin}
                  component={ListProductOfUserComponent}
                />
                <PrivateRoute
                  exact
                  path="/profile"
                  authed={store.getState().isLogin}
                  component={ProfileComponent}
                />
                <Route component={NoMatchComponent} />
              </Switch>
            </div>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default AppContainer;
//Router https://www.sitepoint.com/react-router-v4-complete-guide/
