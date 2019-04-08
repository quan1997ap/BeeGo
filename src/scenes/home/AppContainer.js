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


import { setStorageService, getStorageService } from "../../service/storeage-service";

/* PrivateRoute component definition */
const PrivateRoute = ({component: Component, authed, ...rest}) => {
  return (
    <Route
      {...rest}
      render={(props) => authed === true
        ? <Component {...props} />
        : <Redirect to={{pathname: '/login', state: {from: props.location}}} />} />
  )
}


class AppContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false
    };
  }

  componentDidMount() {
    window.addEventListener('scroll', this._handleScroll);
    getStorageService('token').then(token => {
      if (token != null && token != "token invalid") {
        this.setState({ isAuthenticated: true }, ()=> {
        });
      }
    });
  }

  componentWillUnmount(){
    window.removeEventListener('scroll', this.handleScroll);
  }

  _handleScroll(event) {
      let Header = document.getElementById("Header");
      let wrapRouter = document.getElementById("Wrap-router");
      let searchHeader = document.getElementById("Search-header");
      let headerMenu = document.getElementById("Header-menu");
     
      let positionScrollBar = window.scrollY;

      if (positionScrollBar < 25 ){
        wrapRouter.style.marginTop = 0; 
        Header.classList.remove("Position-fixed");
        searchHeader.classList.remove("Style-search-header");
        headerMenu.classList.remove("Style-menu-header");
      }
      else{
        wrapRouter.style.marginTop = "90px"; 
        Header.classList.add("Position-fixed");
        searchHeader.classList.add("Style-search-header");
        headerMenu.classList.add("Style-menu-header");
      }
  }

  render() {
    return (
      <Router>
       <TransitionGroup>
          <CSSTransition classNames="fadein" timeout={1000} >
            <div className="App-container">
              <HeaderComponent hideLogin={this.state.isAuthenticated} />
              <div id="Wrap-router">
                <Switch>
                  <Route path="/" exact component={HomeComponent} />
                  <Route path="/signup" exact component={SignUpComponent} />
                  <Route path="/login" exact component={LoginComponent} />
                  <PrivateRoute authed={this.state.isAuthenticated} path='/profile' component = {ProfileComponent} />
                  <Route component={NoMatchComponent} />
                </Switch>
              </div>
            </div>
          </CSSTransition>
       </TransitionGroup>
      </Router>
    );
  }
}


export default AppContainer;
// https://www.sitepoint.com/react-router-v4-complete-guide/