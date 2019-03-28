import React, { Component } from "react";
import "./Home.css";
import HeaderComponent from "../../components/HeaderComponent.js/HeaderComponent";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect
} from "react-router-dom";

import ProfileComponent from "../../components/ProfileComponent/ProfileComponent";
import LoginComponent from "../../components/LoginComponent/LoginComponent";
import SignUpComponent from "../../components/SignUpComponent/SignUpComponent";
import NoMatchComponent from "../../components/NoMatchComponent/NoMatchComponent";

class HomePage extends Component {
  render() {
    return (
      <div className="App-container">
        <Router>
          <HeaderComponent />
          <Switch>
            <Route path="/signup" component={SignUpComponent} />
            <Route path="/profile" component={ProfileComponent} />
            <Route path="/login" component={LoginComponent} />
            <Route component={NoMatchComponent} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default HomePage;
