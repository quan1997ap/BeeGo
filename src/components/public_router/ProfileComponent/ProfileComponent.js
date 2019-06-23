import React, { Component } from "react";
import "./ProfileComponent.css";
import "../HomeComponent/ProductList/ProductList.css";
import { Row, Col, Button } from "react-bootstrap";
import { getUserInfo } from "../../../service/general-service";

class ProfileComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      userInfo: {}
    };
  }
  componentDidMount(){
    getUserInfo().then(
      infoRes => {
        if(infoRes && infoRes.data !== undefined){
          this.setState({
            userInfo : infoRes.data
          })
        }
      }
    )
  }


  render() {
    return (
      <div className="container-custom search-component">
          <div className="user-card">
              <p className = "cart-name">THÔNG TIN CÁ NHÂN</p>

              <p className= "info-detail">
                <span className="title">Name:</span>
                <span className="detail">{this.state.userInfo.info ? this.state.userInfo.info.name : "without information" }</span>
              </p><hr/>

              <p className= "info-detail">
                <span className="title">Address:</span>
                <span className="detail">{ this.state.userInfo.info ? this.state.userInfo.info.address : "without information"}</span>
              </p><hr/>

              <p className= "info-detail">
                <span className="title">Phone:</span>
                <span className="detail">{this.state.userInfo.info ? this.state.userInfo.info.phone : "without information"}</span>
              </p><hr/>

              <p className= "info-detail">
                <span className="title">Email:</span>
                <span className="detail">{this.state.userInfo.email}</span>
              </p><hr/>

              <p className= "info-detail">
                <span className="title">Hình đại diện:</span>
                <img src = {this.state.userInfo.info && this.state.userInfo.info.avatar.length > 0 ? this.state.userInfo.info.avatar[0] : "https://img2.thuthuatphanmem.vn/uploads/2018/11/30/anh-dep-lam-hinh-dai-dien_104206753.jpg" } className="avatar" />
              </p>
             
          </div>
      </div>
    );
  }
}

export default ProfileComponent;
