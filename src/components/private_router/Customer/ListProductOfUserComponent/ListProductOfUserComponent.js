import React, { Component } from "react";
import "./ListProductOfUserComponent.css";
// import { Button } from 'react-bootstrap';

class ListProductOfUserComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount(){  
  }

  render() {
    return(
      <div className="container-custom">
          <div className="user-card">
              <p className = "cart-name">GIỎ HÀNG CỦA BẠN</p>
          </div>
      </div>
    )
   
  }
}
export default ListProductOfUserComponent;
