import React, { Component } from "react";
import "./LoadingComponent.css";

class LoadingComponent extends Component {
  constructor(props){
    super(props);
  }

  componentDidMount(){
    // console.log(this.props.auth);
  }

  componentDidUpdate(){
    // console.log('update')
    // console.log(this.props.auth);
  }
  render() {
    return (
      <div className="Login-component">
        <div className="limiter Background-login">
        loading
            <div className="lds-ripple"><div></div><div></div></div>
        </div>
      </div>
    );
  }
}

export default LoadingComponent;
