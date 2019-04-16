import React, { Component } from "react";
import "./ProfileComponent.css";
import { getInfoUser } from "../../service/login-service";
import { getStorageService } from "../../service/storeage-service";

import { Button, Tabs, Tab, Table, Modal, Dialog} from "react-bootstrap";
import { getListUserWithPermision } from "../../service/admin-service";
import { blockUserService , unblockUserService} from '../../service/admin-service';

class ProfileComponent extends Component {
  constructor(props){
    super(props);
    this.state={
      userData: {},
      listProvider: [],
      listCustomer: [],
      token: "",
      errGetCustomer: "",
      errGetProvider: "",
      showModal: false,
      messageModal: "",
      userIdSelected: "",
      statusUserSelected: null
    }
  }

  _getListUserWithTokenAdmin(token){
    getListUserWithPermision(token, 'provider')
    .then( res => this.setState({listProvider: res.data }, ()=> console.log(this.state.listProvider)))
    .catch( e => this.setState({errGetProvider: e}) )
    
    getListUserWithPermision(token, 'customer')
    .then( res => this.setState({listCustomer: res.data }, ()=> console.log(this.state.listCustomer)))
    .catch( e => this.setState({errGetCustomer: e}) )
  }


  componentWillMount(){
    getStorageService('token').then(
      token => 
      getInfoUser(token).then(
        userData =>
        {
          this.setState({userData : userData.data}) 
          this.setState({token : token}, () => {
            this._getListUserWithTokenAdmin(this.state.token);
          })
        }

      )
    )
  }

  _handleCloseModal() {
    if(this.statusUserSelected === true){
      // dang bi khoa => mo
      unblockUserService()
    }
    else if(this.statusUserSelected === false){
      blockUserService()
    }
    this.setState({ showModal: false });
  }

  _handleShowModal(idUser, status, username) {
    let translate = ( status == true) ? "mở khóa" :  'khóa';
    this.setState({userIdSelected : idUser, statusUserSelected : status , messageModal : `Bạn có muốn ${translate} tài khoản ${username} ?` }, ()=>{
      this.setState({showModal: true})
    })
  }

  _renderListUser(list){
    const listItems = list.map((item,index) =>
      <tr key = {index}>
          <td>{index}</td>
          <td>{item._id}</td>
          <td>{item.info.avatar[0]}</td>
          <td>{item.username}</td>
          <td>{item.email}</td>
          <td className="Status-Accout">
            <i className="fas fa-edit Edit-status-account" onClick= {this._handleShowModal.bind(this,item._id, item.isBlock, item.username)}></i>
            <i className= {"far fa-check-circle "+ (item.isBlock !== true ? 'Check-No-Block' : "Display-none")} ></i>  {/* tk bị khóa */}
            <i className= {"far fa-times-circle "+ (item.isBlock === true ? 'Check-Block' : "Display-none")} ></i>  {/* tk không bị khóa */}
          </td>
      </tr>
  );
    return(
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>STT</th>
            <th>ID</th>
            <th>Avata</th>
            <th>Username</th>
            <th>Email</th>
            <th>Block</th>
          </tr>
        </thead>
        <tbody>
            {listItems}
        </tbody>
      </Table>
    )
  }

  render() {
    return (
      <div className="Profile-component">
        <Modal show={this.state.showModal} onHide={this._handleCloseModal.bind(this)}>
          <Modal.Header closeButton>
            <Modal.Title>Thông báo</Modal.Title>
          </Modal.Header>
          <Modal.Body>{this.state.messageModal}</Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={this._handleCloseModal.bind(this)}>
               Đồng ý
            </Button>
          </Modal.Footer>
        </Modal>
        <div  className="container-login100 Profile">
          <br/>
          <p className="Wellcome"> Chào  <span className="UserName">{this.state.userData.username}</span></p>
          <div className="List-user">
            <Tabs defaultActiveKey="user" id="uncontrolled-tab-example">
                <Tab eventKey="user" title="Khách hàng thông thường">
                  { this._renderListUser(this.state.listCustomer) }
                </Tab>
                <Tab eventKey="provider" title="Nhà cung cấp">
                  { this._renderListUser(this.state.listProvider) }
                </Tab>
              </Tabs>
          </div>
        </div>
      </div>
    );
  }
}

export default ProfileComponent;
