import React, { Component } from "react";
import "./AppContainer.css";
import HeaderComponent from "../../components/HeaderComponent.js/HeaderComponent";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";

import ProfileComponent from "../../components/ProfileComponent/ProfileComponent";
import LoginComponent from "../../components/LoginComponent/LoginComponent";
import SignUpComponent from "../../components/SignUpComponent/SignUpComponent";
import NoMatchComponent from "../../components/NoMatchComponent/NoMatchComponent";
import HomeComponent from "../../components/HomeComponent.js/HomeComponent";

class AppContainer extends Component {
  render() {
    return (
      <Router>
        <div className="App-container">
          <HeaderComponent />
          <Switch>
            <Route path="/" exact component={HomeComponent} />
            <Route path="/signup" component={SignUpComponent} />
            <Route path="/profile" component={ProfileComponent} />
            <Route path="/login" component={LoginComponent} />
            <Route component={NoMatchComponent} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default AppContainer;
