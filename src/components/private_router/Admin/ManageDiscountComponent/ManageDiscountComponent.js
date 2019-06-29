import React, { Component } from "react";
import "../../../../styles/mainconfig.css";
import "../../../../styles/main.css";
import "./ManageDiscountComponent.css";
import { Row, Col, Button } from "react-bootstrap";
import {
  getProductsForDiscount,
  addNewDiscountWithPermision
} from "../../../../service/admin-service";
import Spinner from "react-spinner-material";
import moment from "moment";
import {
  ToastsContainer,
  ToastsStore,
  ToastsContainerPosition
} from "react-toasts";

class ManageDiscountComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: "",
      endDate: "",
      productList: [],
      discountNumber: "",
      productFounds: [],
      searchText: "",
      productSelected: [],
      inputSearchLostFocus: false,
      showSuccessMessage: false,
      addSuccess: false,
      processing: false,
      newDiscountStartDate: "",
      newDiscountDueDate: "",
      discountValue: ""
    };
  }

  componentDidMount() {
    this._getProducts();
  }

  xoa_dau(str) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    return str;
  }

  _getProducts() {
    getProductsForDiscount()
      .then(productsRes => {
        if (productsRes && productsRes.data.length > 0) {
          this.setState({ productList: productsRes.data }, () => {
            console.log(this.state.productList);
          });
        }
      })
      .catch();
  }

  _addProduct(product) {
    let _productSelected = Object.assign([], this.state.productSelected);
    let _productList = Object.assign([], this.state.productList);
    let _productFounds = Object.assign([], this.state.productFounds);

    _productList = _productList.filter(
      productItem => productItem._id !== product._id
    );
    _productFounds = _productFounds.filter(
      productItem => productItem._id !== product._id
    );
    _productSelected.push(product);
    this.setState({
      productSelected: _productSelected,
      productList: _productList,
      productFounds: _productFounds,
      searchText: this.state.searchText
    });
  }

  _subProduct(product) {
    let _productSelected = Object.assign([], this.state.productSelected);
    let _productList = Object.assign([], this.state.productList);
    _productList.push(product);
    _productSelected = _productSelected.filter(
      _product => _product._id !== product._id
    );
    this.setState(
      {
        productSelected: _productSelected,
        searchText: this.state.searchText,
        productList: _productList
      },
      () => {
        document.getElementById("search-input").focus();
      }
    );
  }

  _renderProductsSelected() {
    let products = this.state.productSelected.map((product, index) => (
      <div key={index} className="text-left search-product-item no-padding">
        <span className="cut-text cut-text-width-300px">
          {" "}
          &nbsp; {product._id}{" "}
        </span>
        <span className="cut-text cut-text-width-300px">{product.name} </span>
        <span className="cut-text ">{product.price} </span>
        <span className="cut-text ">{product.quantity} </span>
        <span className="cut-text">{product.isSale.toString()} </span>
        <span className="cut-text">{product.isShow.toString()} </span>
        <span
          className="sub-item"
          onClick={this._subProduct.bind(this, product)}
        >
          -
        </span>
      </div>
    ));
    return products;
  }

  _renderProductsFound() {
    let products = this.state.productFounds.map((product, index) => (
      <div
        key={index}
        className="text-left search-product-item"
        onClick={this._addProduct.bind(this, product)}
      >
        <span>{product._id} &nbsp;&nbsp;</span>
        <span className="cut-text">{product.name} </span>
        <span className="add-item">+</span>
      </div>
    ));
    return products;
  }

  inputSearchChange(searchText) {
    let timeout;
    clearTimeout(timeout);
    this.setState({ searchText: searchText }, () => {
      timeout = setTimeout(() => {
        this._searchProduct();
      }, 200);
    });
  }

  _searchProduct() {
    let products = Object.assign([], this.state.productList);
    let productFounds = [];
    products.forEach(product => {
      // let  productName  = this._xoaDau(product.name);
      if (
        product.name &&
        product.name.includes(this.state.searchText) === true
      ) {
        productFounds.push(product);
      }
    });
    this.setState({ productFounds: productFounds });
    return productFounds;
  }

  _addNewDiscount() {
    let startDate = moment(this.state.newDiscountStartDate).format("X");
    let dueDate = moment(this.state.newDiscountDueDate).format("X");
    let productIds = this.state.productSelected.map(product => product._id);
    let newDiscount = {
      startDate: startDate,
      endDate: dueDate,
      products: productIds,
      value: this.state.discountValue
    };
    console.log(newDiscount);
    this.setState({ processing: true, showSuccessMessage: false }, () => {
      addNewDiscountWithPermision(newDiscount)
        .then(resAddDiscount => {
          if (
            resAddDiscount &&
            resAddDiscount.data &&
            resAddDiscount.data.ok === 1
          ) {
            this.setState(
              {
                addSuccess: true,
                showSuccessMessage: true,
                processing: false
              },
              () => {
                ToastsStore.success("Thêm Ma giảm giá thành công");
              }
            );
          } else {
            ToastsStore.error("Có lỗi xảy ra, hãy thử lại !");
          }
        })
        .catch(errData => {
          this.setState({
            processing: false,
            addSuccess: false,
            showSuccessMessage: false
          });
          ToastsStore.error("Có lỗi xảy ra, hãy thử lại !");
          console.log(errData);
        });
    });
  }

  render() {
    return (
      <div className="Discount-component">
        <ToastsContainer
          store={ToastsStore}
          position={ToastsContainerPosition.TOP_RIGHT}
        />
        <div className="container-discount">
          <p className="title-tab">ManageDiscountComponent</p>
          <Row>
            <Col xs={12} sm={5} md={5} lg={4} className="col-padding-top">
              <div className="tab-add-category padding-bottom-150px">
                <p className="sub-title">Ngày bắt đầu</p>
                <input
                  className="input-date-style"
                  type="date"
                  onChange={e => {
                    this.setState({ newDiscountStartDate: e.target.value });
                  }}
                />
                <p className="sub-title">Ngày kết thúc</p>
                <input
                  className="input-date-style"
                  type="date"
                  onChange={e => {
                    this.setState({ newDiscountDueDate: e.target.value });
                  }}
                />
                <p className="sub-title">Sản phẩm áp dụng</p>
                <div className="search-product">
                  <input
                    className="input-date-style input-search"
                    type="text"
                    id="search-input"
                    onBlur={e => this.setState({ inputSearchLostFocus: true })}
                    onFocus={e => {
                      if (this.state.inputSearchLostFocus === true) {
                        this.inputSearchChange(e.target.value);
                      }
                    }}
                    onChange={e => this.inputSearchChange(e.target.value)}
                  />
                  <span
                    className="button-search"
                    onClick={this._searchProduct.bind(this)}
                  >
                    <i className="fas fa-search" />
                  </span>
                  <div className="product-found">
                    {this._renderProductsFound()}
                  </div>
                </div>
                <p className="sub-title">% giảm giá</p>
                <input
                  className="input-date-style"
                  type="text"
                  onChange={e => {
                    this.setState({ discountValue: e.target.value });
                  }}
                />

                <div className="parent">
                  {/* processing */}
                  <div
                    className={
                      "Processing " +
                      (this.state.processing === true
                        ? "block"
                        : "display-none")
                    }
                  >
                    <Spinner
                      size={20}
                      spinnerColor={"#3d9191"}
                      spinnerWidth={4}
                      visible={true}
                    />
                    <span>Processing ...</span>
                  </div>

                  {/* responseMessage */}
                  <div
                    className={
                      "Processing " +
                      (this.state.processing === false &&
                      this.state.showSuccessMessage === true
                        ? "block"
                        : "display-none") +
                      (this.state.addSuccess === true ? " SUCCESS" : " FAIL")
                    }
                  >
                    <i
                      className={
                        this.state.addSuccess === true
                          ? "far fa-check-circle"
                          : "far fa-times-circle"
                      }
                    />
                    <span>
                      {" "}
                      {this.state.addSuccess === true
                        ? "Thành công"
                        : "Thất bại"}{" "}
                    </span>
                  </div>

                  <button
                    className={
                      this.state.editCategory === true ? "d-none" : "button-add"
                    }
                    disabled={this.setState.processing}
                    onClick={this._addNewDiscount.bind(this)}
                  >
                    {this.state.processing === true
                      ? "Đang thêm ..."
                      : "Thêm mới"}
                  </button>
                </div>
              </div>
            </Col>
            <Col xs={12} sm={7} md={7} lg={8} className="col-padding-top">
              <p className="sub-title">Danh sách sản phẩm áp dụng</p>
              <p className="border-title">
                <span className="cut-text cut-text-width-300px border-cut-text">
                  {" "}
                  ID
                </span>
                <span className="cut-text cut-text-width-300px border-cut-text">
                  {" "}
                  NAME{" "}
                </span>
                <span className="cut-text border-cut-text"> PRICE </span>
                <span className="cut-text border-cut-text"> QUANTITY </span>
                <span className="cut-text border-cut-text"> SALE </span>
                <span className="cut-text border-cut-text">SHOW </span>
              </p>
              {this._renderProductsSelected()}
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default ManageDiscountComponent;
