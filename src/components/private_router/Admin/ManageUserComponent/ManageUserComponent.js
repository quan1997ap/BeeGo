import React, { Component } from "react";
import "./ManageUserComponent.css";
import { Button, Tabs, Tab, Table, Modal, Dialog } from "react-bootstrap";
import cancelRequest, {
  blockUserService,
  unblockUserService,
  getListUserWithPermision
} from "../../../../service/admin-service";
import Spinner from "react-spinner-material";
import {
  ToastsContainer,
  ToastsStore,
  ToastsContainerPosition
} from "react-toasts";
import _ from "lodash";
import { getInfoUser } from "../../../../service/login-service";
import { getStorageService } from "../../../../service/storeage-service";


class ManageUserComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: {},
      listProvider: [],
      listCustomer: [],
      token: "",
      errGetCustomer: "",
      errGetProvider: "",
      showModal: false,
      messageModal: "",
      userSelected: "",
      isLoading: false,
      currentPageCustomer: 0,
      currentPageProvider: 0
    };
  }

  _getListUserWithTokenAdmin() {
    getListUserWithPermision("provider", 0, 10)
      .then(res => {
        this.setState({ listProvider: res.data,  currentPageProvider : 1});
      })
      .catch(e => this.setState({ errGetProvider: e }));

    getListUserWithPermision("customer", 0, 10)
      .then(res => this.setState({ listCustomer: res.data , currentPageCustomer: 1 }))
      .catch(e => this.setState({ errGetCustomer: e }));
  }

  componentWillMount() {
    getStorageService("token").then(token =>
      getInfoUser(token).then(userData => {
        this.setState({ userData: userData.data });
        this._getListUserWithTokenAdmin();
      })
    );
  }

  _replaceItemInArr(UserInfoArr = [], dataItem, typeArr) {;
    const length = UserInfoArr.length;
    if (length > 0 && length != undefined) {
      for (let i = 0; i < length; i++) {
        if (UserInfoArr[i]._id === dataItem._id) {
          UserInfoArr[i] = dataItem;
          break;
        }
      }
    }

    if (typeArr === "customer") {
      this.setState({ listCustomer: UserInfoArr });
    } else if (typeArr === "provider") {
      this.setState({ listProvider: UserInfoArr });
    }
  }

  _handleCloseModal() {
    this.setState({
      userSelected: null,
      showModal: false
    });
  }

  _handleAcceptModal() {
    this.setState({ isLoading: true });
    if (this.state.userSelected !== undefined) {
      if (this.state.userSelected.isBlock === true) {
        // dang bi khoa => mo
        let userSelectedToggleStatus = this.state.userSelected;
        userSelectedToggleStatus.isBlock = false;

        unblockUserService(this.state.userSelected._id)
          .then(res => {
            if (res && res.data.message === "unBlock success!") {
              this._replaceItemInArr(
                this.state.userSelected.type === "customer"
                  ? this.state.listCustomer
                  : this.state.listProvider,
                userSelectedToggleStatus,
                this.state.userSelected.type
              );
              this.setState({ showModal: false, isLoading: false }, () => {
                ToastsStore.success("Mở khóa thành công");
                cancelRequest();
              });
            }
          })
          .catch(e => {
            this.setState({ showModal: false, isLoading: false }, () => {
              ToastsStore.error("Có lỗi xảy ra, hãy thử lại !");
              cancelRequest();
            });
          });
      } else if (this.state.userSelected.isBlock === false) {
        // dang  k bi khoa => khoa
        let userSelectedToggleStatus = this.state.userSelected;
        userSelectedToggleStatus.isBlock = true;

        blockUserService(this.state.userSelected._id)
          .then(res => {
            if (res && res.data.message === "Block success!") {
              this._replaceItemInArr(
                this.state.userSelected.type === "customer"
                  ? this.state.listCustomer
                  : this.state.listProvider,
                userSelectedToggleStatus,
                this.state.userSelected.type
              );
              this.setState({ showModal: false, isLoading: false }, () => {
                ToastsStore.success("Khóa thành công");
                cancelRequest();
              });
            }
          })
          .catch(e => {
            this.setState({ showModal: false, isLoading: false }, () => {
              ToastsStore.error("Có lỗi xảy ra, hãy thử lại !");
              cancelRequest();
            });
          });
      }
    }
  }

  _handleShowModal(_userSelected) {
    let translateStatus = _userSelected.isBlock == true ? "mở khóa" : "khóa"; // khóa => mở khóa, ngược lại
    let translateTypeUser =
      _userSelected.type == "provider" ? "người cung cấp" : "người dùng";
    this.setState(
      {
        userSelected: _userSelected,
        messageModal: `Bạn có muốn ${translateStatus} tài khoản ${translateTypeUser}  ${
          _userSelected.username
        }  không ?`
      },
      () => {
        this.setState({ showModal: true });
      }
    );
  }

  _loadMoreTable(typeArr) {
    // 10 phan tu 1 lan
    if (typeArr === "customer") {
      getListUserWithPermision(
        "customer",
        this.state.currentPageCustomer * 10,
        this.state.currentPageCustomer * 10 + 10
      ).then(resListCustomer => {
        this.setState({
          currentPageCustomer: this.state.currentPageCustomer + 1,
          listCustomer: this.state.listCustomer.concat(resListCustomer.data)
        });
      }).catch(
        e => {
          console.log(e);
          ToastsStore.error("Có lỗi xảy ra, hãy thử lại !");
          cancelRequest();
        }
      )
    } else if (typeArr === "provider") {
      console.log(typeArr)
      getListUserWithPermision(
        "provider",
        this.state.currentPageProvider * 10,
        this.state.currentPageProvider * 10 + 10
      ).then(resListProvider => {
        this.setState({
          currentPageProvider: this.state.currentPageProvider + 1,
          listProvider: this.state.listProvider.concat(resListProvider.data)
        });
      }).catch(
        e => {
          console.log(e);
          ToastsStore.error("Có lỗi xảy ra, hãy thử lại !");
          cancelRequest();
        }
      )
    }
  }

  _renderListUser(list) {
    const listItems = list.map((item, index) => (
      <tr key={index}>
        <td>{index}</td>
        <td>{item._id}</td>
        <td>{item.info.avatar[0]}</td>
        <td>{item.username}</td>
        <td>{item.email}</td>
        <td className="Status-Accout">
          <i
            className="fas fa-edit Edit-status-account"
            onClick={this._handleShowModal.bind(this, item)}
          />
          <i
            className={
              "far fa-check-circle " +
              (item.isBlock !== true ? "Check-No-Block" : "Display-none")
            }
          />{" "}
          {/* tk bị khóa */}
          <i
            className={
              "far fa-times-circle " +
              (item.isBlock === true ? "Check-Block" : "Display-none")
            }
          />{" "}
          {/* tk không bị khóa */}
        </td>
      </tr>
    ));
    return (
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
        <tbody>{listItems}</tbody>
      </Table>
    );
  }

  render() {
    return (
      <div className="Profile-component">
        <Modal
          show={this.state.showModal}
          onHide={this._handleCloseModal.bind(this)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Thông báo</Modal.Title>
          </Modal.Header>
          <Modal.Body>{this.state.messageModal}</Modal.Body>
          <Modal.Footer className="position-relative">
            <div
              className={
                "Modal-footer-loadding " +
                (this.state.isLoading === true ? "" : "Display-none")
              }
            >
              <Spinner
                size={20}
                spinnerColor={"#333"}
                spinnerWidth={4}
                visible={true}
              />
              <p> loading ...</p>
            </div>
            <Button
              variant="primary"
              onClick={this._handleAcceptModal.bind(this)}
            >
              Đồng ý
            </Button>
          </Modal.Footer>
        </Modal>

        <ToastsContainer
          store={ToastsStore}
          position={ToastsContainerPosition.TOP_RIGHT}
        />

        <div className="container-login100 Profile">
          <br />
          <p className="Wellcome">
            {" "}
            Chào{" "}
            <span className="UserName">{this.state.userData.username}</span>
          </p>
          <div className="List-user">
            <Tabs defaultActiveKey="user" id="uncontrolled-tab-example">
              <Tab eventKey="user" title="Khách hàng thông thường">
                {this._renderListUser(this.state.listCustomer)}
                <Button className="Loadmore-button" onClick= {this._loadMoreTable.bind(this, 'customer')}>Load More</Button>
              </Tab>
              <Tab eventKey="provider" title="Nhà cung cấp">
                {this._renderListUser(this.state.listProvider)}
                <Button className="Loadmore-button" onClick= {this._loadMoreTable.bind(this, 'provider')}>Load More</Button>
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    );
  }
}

export default ManageUserComponent;
