﻿import React, { Component } from "react";
import "./ManageUserComponent.css";
import { Button, Tabs, Tab, Table, Modal, Dialog } from "react-bootstrap";
import cancelRequest, {
  blockUserService,
  unblockUserService,
  getListUserWithPermision,
  blockMultiUserService,
  unblockMultiUserService
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
import Checkbox from "./component/Checkbox";


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
      currentPageProvider: 0,
      listUserSelected: [],
      displayBlockCustomerItem: null,
      displayBlockProviderItem: null,
      isBlockWithList: null // null = làm việc với user, true = block list user , false unblock list user
    };
  }

  _getListUserWithTokenAdmin() {
    getListUserWithPermision("provider", 0, 10)
      .then(res => {
        this.setState({ listProvider: res.data, currentPageProvider: 1 });
      })
      .catch(e => this.setState({ errGetProvider: e }));

    getListUserWithPermision("customer", 0, 10)
      .then(res =>
        this.setState({ listCustomer: res.data, currentPageCustomer: 1 })
      )
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

  _replaceItemInArr(UserInfoArr = [], dataItem, typeArr) {
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
      showModal: false,
      isBlockWithList: null,
      isLoading: false
    });
  }

  _toggleStatusUser() {
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

  _toggleStatusListUser(isBlockWithList) {
    //this.state.isBlockWithList == true => block list user và ngược lại
    if (isBlockWithList === true) {
      blockMultiUserService(this.state.listUserSelected).then(data => {
        if (data.data.ok === 1) {
          console.log(data.data.ok);
        }
      })
    } else if (isBlockWithList === false) {
      console.log('else')
      unblockMultiUserService(this.state.listUserSelected).then(data => {
        if (data.data.ok === 1) {
          console.log(data.data.ok);
        }
      })
    }
  }

  _handleAcceptModal(isBlockWithList) {
    if (isBlockWithList === null) {
      // mở khóa or khóa 1 user
      this._toggleStatusUser();
    } else if (isBlockWithList === true || isBlockWithList === false ) {
      // mở khóa or khóa list user
      this._toggleStatusListUser(isBlockWithList);
    }
  }

  _handleShowModal(_userSelected, isBlockWithList) {
    if (isBlockWithList === "notselectall") {
      let translateStatus = _userSelected.isBlock === true ? "mở khóa" : "khóa"; // khóa => mở khóa, ngược lại
      let translateTypeUser =
        _userSelected.type === "provider" ? "người cung cấp" : "người dùng";
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
    } else if (isBlockWithList === true || isBlockWithList === false) {
      let translateStatus = isBlockWithList !== true ? "mở khóa" : "khóa";
      this.setState(
        {
          userSelected: null,
          messageModal: `Bạn có muốn ${translateStatus} các tài khoản đã chọn không ?`,
          isBlockWithList: isBlockWithList
        },
        () => {
          this.setState({ showModal: true });
        }
      );
    }
  }

  _loadMoreTable(typeArr) {
    // 10 phan tu 1 lan
    if (typeArr === "customer") {
      getListUserWithPermision(
        "customer",
        this.state.currentPageCustomer * 10,
        this.state.currentPageCustomer * 10 + 10
      )
        .then(resListCustomer => {
          if (resListCustomer.data.length === 0) {
            ToastsStore.success("Bạn đang ở cuối danh sách");
          }
          this.setState({
            currentPageCustomer: this.state.currentPageCustomer + 1,
            listCustomer: this.state.listCustomer.concat(resListCustomer.data)
          });
        })
        .catch(e => {
          ToastsStore.error("Có lỗi xảy ra, hãy thử lại !");
          cancelRequest();
        });
    } else if (typeArr === "provider") {
      getListUserWithPermision(
        "provider",
        this.state.currentPageProvider * 10,
        this.state.currentPageProvider * 10 + 10
      )
        .then(resListProvider => {
          if (resListProvider.data.length === 0) {
            ToastsStore.success("Bạn đang ở cuối danh sách");
          }
          this.setState({
            currentPageProvider: this.state.currentPageProvider + 1,
            listProvider: this.state.listProvider.concat(resListProvider.data)
          });
        })
        .catch(e => {
          console.log(e);
          ToastsStore.error("Có lỗi xảy ra, hãy thử lại !");
          cancelRequest();
        });
    }
  }

  _setListUserSelected = (_id) => {
    let listUserSelected = this.state.listUserSelected;
    // check, nếu có id trong mảng => hủy check box (remove id khỏi mảng) và ngược lại
    //
    if (this._setDefaultValueCheckbox(_id) === null) {
      // chưa có trong mảng => phải thêm
      this.setState(
        {
          listUserSelected: listUserSelected.concat([_id])
        },
        () => {
          console.log(this.state.listUserSelected);
        }
      );
    } else if (
      this._setDefaultValueCheckbox(_id) !== null &&
      this._setDefaultValueCheckbox(_id) !== undefined
    ) {
      // đã có trong mảng => phải remove
      var filtered = this.state.listUserSelected.filter(function(value) {
        return value !== _id;
      });
      this.setState(
        {
          listUserSelected: filtered
        },
        () => {
          console.log(this.state.listUserSelected);
        }
      );
    }
  }

  selectedAllUser(typeAccount) {
    if (typeAccount === "customer") {
      let arrSelected = this.state.listCustomer.map(customer => customer._id);
      this.setState({
        listUserSelected: arrSelected
      });
    } else if (typeAccount === "customer") {
      let arrProvider = this.state.listProvider.map(customer => customer._id);
      this.setState({
        listUserSelected: arrProvider
      });
    }
  }

  _blockListSelectUser() {
    this._handleShowModal(null, true);
  }
  _unBlockListSelectUser() {
    this._handleShowModal(null, false);
  }

  _setDefaultValueCheckbox(_id) {
    // kiểm tra xem giá trị select có tồn tại trong bảng k
    let checkResult;
    console.log(this.state.listUserSelected);
    let listUserSelected = Object.assign([], this.state.listUserSelected);
    let lengthListUserSelected = listUserSelected.length;
    if (lengthListUserSelected > 0) {
      for (let i = 0; i < lengthListUserSelected; i++) {
        if (this.state.listUserSelected[i] === _id) {
          checkResult = _id;
          break;
        } else {
          checkResult = null;
        }
      }
    } else {
      checkResult = null;
    }
    return checkResult;
  }

  _renderListUser(list) {
    const listItems = list.map((item, index) => (
      <tr key={index}>
        <td>
          <input
            key={item._id}
            onChange={() => this._setListUserSelected(item._id)}
            type="checkbox"
            defaultChecked={
              this._setDefaultValueCheckbox(item._id) === null ? false : true
            }
          />
          {/* <Checkbox name={item._id} defaultChecked={this._setDefaultValueCheckbox(item._id) === null ? false : true} onChange={this._setListUserSelected(item._id)} /> */}
        </td>
        <td>{index}</td>
        <td>{item._id}</td>
        <td>{item.info.avatar[0]}</td>
        <td>{item.username}</td>
        <td>{item.email}</td>
        <td className="Status-Accout">
          <i
            className="fas fa-edit Edit-status-account"
            onClick={this._handleShowModal.bind(this, item, "notselectall")}
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
            <th />
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
    console.log('rerender')
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
              onClick={this._handleAcceptModal.bind(
                this,
                this.state.isBlockWithList
              )}
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
            <Tabs defaultActiveKey="user" 
               onClick={e => e.preventDefault()}
               onSelect={() => { this.setState({listUserSelected : null} , () => {console.log(this.state.listUserSelected)})}}
               id="uncontrolled-tab-example">
              <Tab eventKey="user" title="Khách hàng thông thường">
                {this._renderListUser(this.state.listCustomer)}
                <Button
                  className="Loadmore-button"
                  onClick={this._loadMoreTable.bind(this, "customer")}
                >
                  Load More
                </Button>
                <Button
                  className="Loadmore-button"
                  onClick={this._blockListSelectUser.bind(this, "customer")}
                >
                  Block Selected
                </Button>
                <Button
                  className="Loadmore-button"
                  onClick={this._unBlockListSelectUser.bind(this, "customer")}
                >
                  Unblock Selected
                </Button>
              </Tab>
              <Tab eventKey="provider" title="Nhà cung cấp">
                {this._renderListUser(this.state.listProvider)}
                <Button
                  className="Loadmore-button"
                  onClick={this._loadMoreTable.bind(this, "provider")}
                >
                  Load More
                </Button>
                <Button
                  className="Loadmore-button"
                  onClick={this._blockListSelectUser.bind(this, "customer")}
                >
                  Block Selected
                </Button>
                <Button
                  className="Loadmore-button"
                  onClick={this._unBlockListSelectUser.bind(this, "customer")}
                >
                  Unblock Selected
                </Button>
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    );
  }
}

export default ManageUserComponent;
