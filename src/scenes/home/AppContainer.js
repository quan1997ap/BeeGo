import React, { Component } from "react";
import "./AppContainer.css";
import HeaderComponent from "../../components/HeaderComponent/HeaderComponent";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";

import ProfileComponent from "../../components/ProfileComponent/ProfileComponent";
import LoginComponent from "../../components/LoginComponent/LoginComponent";
import SignUpComponent from "../../components/SignUpComponent/SignUpComponent";
import NoMatchComponent from "../../components/NoMatchComponent/NoMatchComponent";
import HomeComponent from "../../components/HomeComponent/HomeComponent";
import ListProductOfUserComponent from "../../components/ListProductOfUserComponent/ListProductOfUserComponent";
import { getStorageService } from "../../service/storeage-service";
import { ckeckTokenService } from "../../service/login-service";

import { createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from "../../redux/reducers/rootReduces";
import { Login } from "../../redux/actions/checkAuthorizeAction";


// Create store
const store = createStore(rootReducer);

/* PrivateRoute component definition */
const PrivateRoute = ({ component: Component, authed, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        authed === true ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        )
      }
    />
  );
};
// appContainer => 1 pageForm
// khi mới vào app => check isAuthenticated để đưa vào trong private Router như 1 prop => xác định có cho router đến k

class AppContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false
    };
  }

  componentDidMount() {
    window.addEventListener("scroll", this._handleScroll);
    // check token dang nhap
    getStorageService("token").then(token => {
      if (token !== null && token !== "token invalid") {
        ckeckTokenService(token).then(
          statusToken => {
            if (statusToken.status == 200) {
              store.dispatch(Login(true));
              this.setState({ isAuthenticated: true });
            }
          }
        )
      }
      else{
        store.dispatch(Login(false))
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
          <TransitionGroup>
            <CSSTransition classNames="fadein" timeout={1000}>
              <div className="App-container">
                <HeaderComponent/>
                <div id="Wrap-router">
                  <Switch>
                    <Route path="/" exact component={HomeComponent} />
                    <Route path="/signup" exact component={SignUpComponent} />
                    <Route path="/login" exact component={LoginComponent} />
                    <PrivateRoute
                      path="/list-product-of-user"
                      authed={store.getState().isLogin}
                      exact
                      component={ListProductOfUserComponent}
                    />
                    <PrivateRoute
                      authed={this.state.isAuthenticated}
                      exact
                      path="/profile"
                      component={ProfileComponent}
                    />
                    <Route component={NoMatchComponent} />
                  </Switch>
                </div>
              </div>
            </CSSTransition>
          </TransitionGroup>
        </Router>
      </Provider>
    );
  }
}

export default AppContainer;
//Router https://www.sitepoint.com/react-router-v4-complete-guide/
