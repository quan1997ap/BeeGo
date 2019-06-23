import React, { Component } from "react";
import "./ManageProduct.css";
import { Row, Col, Button, Table, Modal, Dialog } from "react-bootstrap";
import cancelRequest, {
  getListCategoryWithPermision
} from "../../../../service/admin-service";
import Spinner from "react-spinner-material";
import {
  ToastsContainer,
  ToastsStore,
  ToastsContainerPosition
} from "react-toasts";
import { ProductInfoModel } from "../../../../model/productinfo.model";
import axios from "axios";
import ReadMoreReact from "read-more-react";
import {
  addNewProduct,
  getAllProductOfProvider,
  editProduct
} from "../../../../service/provider-service";
import { _validateNumber } from "../../../../configs/validates";

class ManageProductComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errGetCategory: {},
      listCategory: [],
      listSourceCategory: [],
      listRootCategory: [],
      processing: false,
      addSuccess: false,
      showSuccessMessage: false,

      // add new
      listProduct: [],
      productName: "",
      productPrice: "",
      productDescription: "",
      categoryID: "",
      isDiscountProduct: false,
      discountNumber: "",
      maxProductOrder: "",
      quantityProduct: "",

      // edit
      isEditProduct: false,
      leftButtonText: "Thêm mới",
      oldProduct: {},

      // validate form
      inputPriceFocus: false,
      inputMaxOrderFocus: false,
      inputQuantityOrderFocus: false,
      inputDiscountOrderFocus: false,

      inputPriceLostFocus: false,
      inputMaxOrderLostFocus: false,
      inputQuantityOrderLostFocus: false,
      inputDiscountOrderLostFocus: false
    };
  }

  componentDidMount() {
    this._getListCategoryWithPermision();
    this._getListProductForCustomer();
  }

  _getListProductForCustomer() {
    getAllProductOfProvider().then(resListProduct => {
      this.setState({ listProduct: resListProduct.data });
    });
  }

  _interpolationListCategory(arrAll, arrRoot, k) {
    // tạo ra mảng mới kiểu tree bằng cách nội suy từ mảng all category và rootCategory
    let arrResultInterpolation = [...arrRoot]; // deep copy
    let arrParentLength = arrAll.length;
    let arrChildLength = arrRoot.length;
    if (
      arrParentLength === undefined ||
      arrChildLength === undefined ||
      arrParentLength === 0 ||
      arrChildLength === 0
    ) {
      return 0;
    } else if (arrAll.length > 0 && arrRoot.length > 0) {
      arrRoot.forEach((arrRootElement, index) => {
        let newArrChild = [];
        // loop
        arrAll.forEach((arrAllElement, i) => {
          if (
            arrAllElement.parentId !== null &&
            arrAllElement.parentId._id === arrRootElement._id
          ) {
            newArrChild.push(arrAllElement);
          }
        });

        arrRoot[index].child = newArrChild;
        arrRoot[index].level = k + 1;
        this._interpolationListCategory(
          arrAll,
          newArrChild,
          arrRoot[index].level
        );
      });
    }
    return arrResultInterpolation;
  }

  _getListCategoryWithPermision() {
    axios
      .all([
        getListCategoryWithPermision("all", 0, 350),
        getListCategoryWithPermision("null", 0, 350)
      ])
      .then(arrListCategory => {
        this.setState({
          listSourceCategory: arrListCategory[0].data,
          listRootCategory: arrListCategory[1].data
        });
        let convertDataListCategory = this._interpolationListCategory(
          arrListCategory[0].data,
          arrListCategory[1].data,
          0
        );
        this.setState({ listCategory: convertDataListCategory });
      })
      .catch(e => this.setState({ errGetCategory: e }));
  }

  _renderSelectCategory(listCategory) {
    let listOption;
    if (listCategory.length > 0) {
      listOption = listCategory.map((itemCategory, index) => {
        let listOptionTG;
        // chèn thêm 1 dấu cách vào trước option
        if (itemCategory.level === 1) {
          listOptionTG = (
            <option
              key={"level-" + itemCategory._id}
              value={itemCategory._id}
              className={"option-level-" + itemCategory.level}
            >
              {itemCategory.name}
            </option>
          );
        } else if (itemCategory.level === 2) {
          listOptionTG = (
            <option
              key={"level-" + itemCategory._id}
              value={itemCategory._id}
              className={"option-level-" + itemCategory.level}
            >
              &nbsp;&nbsp; {itemCategory.name}
            </option>
          );
        } else if (itemCategory.level === 3) {
          listOptionTG = (
            <option
              key={"level-" + itemCategory._id}
              value={itemCategory._id}
              className={"option-level-" + itemCategory.level}
            >
              &nbsp;&nbsp;&nbsp;&nbsp; {itemCategory.name}
            </option>
          );
        } else if (itemCategory.level === 4) {
          listOptionTG = (
            <option
              key={"level-" + itemCategory._id}
              value={itemCategory._id}
              className={"option-level-" + itemCategory.level}
            >
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {itemCategory.name}
            </option>
          );
        } else if (itemCategory.level === 4) {
          listOptionTG = (
            <option
              key={"level-" + itemCategory._id}
              value={itemCategory._id}
              className={"option-level-" + itemCategory.level}
            >
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
              {itemCategory.name}
            </option>
          );
        }

        // nội suy
        if (itemCategory.child !== undefined && itemCategory.child.length > 0) {
          listOptionTG = [
            listOptionTG,
            this._renderSelectCategory(itemCategory.child)
          ];
          return listOptionTG;
        } else {
          return listOptionTG;
        }
      });
    }
    return listOption;
  }

  _renderListProduct(listProduct) {
    let listProductDetail;
    listProductDetail = listProduct.map((product, index) => {
      if (product.isShow == true) {
        return (
          // chèn thêm 1 dấu cách vào trước option
          <tr key={"level-" + product._id}>
            <td>{product.name} </td>
            <td>{product.description} </td>
            <td>{product.price}</td>
            <td>{product.quantity}</td>
            <td>{product.maxOrder}</td>
            <td>{product.sale}</td>
            <td>
              <Button
                className="edit-button"
                onClick={this._openEditProduct.bind(this, product)}
              >
                Edit
              </Button>
              <Button
                className="delete-button"
                onClick={this._deleteProduct.bind(this, product)}
              >
                Del
              </Button>
            </td>
          </tr>
        );
      }
    });

    return listProductDetail;
  }

  validateData() {
    let validateErr = "";
    if (
      this.state.productName === "" ||
      this.state.productPrice === "" ||
      this.state.quantityProduct === "" ||
      this.state.maxProductOrder === "" ||
      this.state.quantityProduct === ""
    ) {
      validateErr += "Bạn phải nhập đủ các trường";
    }
  }
  _addNewProduct() {
    this.setState({ processing: true, showSuccessMessage: false }, () => {
      let newProduct = new ProductInfoModel(
        this.state.productName,
        this.state.productPrice,
        this.state.productDescription,
        this.state.maxProductOrder,
        this.state.quantityProduct,
        this.state.categoryID,
        true,
        this.state.isDiscountProduct,
        this.state.discountNumber
      );
        console.log(newProduct);
      addNewProduct(newProduct)
        .then(resNewsProduct => {
          console.log(resNewsProduct);
          if (resNewsProduct.data.message === "Add Product success") {
            this.setState(
              {
                productName: "",
                productPrice: "",
                productDescription: "",
                maxProductOrder: "",
                quantityProduct: "",
                addSuccess: true,
                showSuccessMessage: true,
                processing: false
              },
              () => {
                let listProduct = this.state.listProduct;
                let newListProduct = listProduct.concat([
                  resNewsProduct.data.data
                ]);
                this.setState({ listProduct: newListProduct });
                ToastsStore.success("Thêm sản phẩm thành công");
              }
            );
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
  _closeEdit() {
    this.setState({
      isEditProduct: false,
      productName: "",
      productPrice: "",
      productDescription: "",
      quantityProduct: "",
      maxProductOrder: "",
      categoryID: "",
      isDiscountProduct: false,
      discountNumber: 0,
      showSuccessMessage: false,
      processing: false,
      oldProduct: {}
    });
  }

  _openEditProduct(oldProduct) {
    this.setState({
      isEditProduct: true,
      productName: oldProduct.name,
      productPrice: oldProduct.price,
      productDescription: oldProduct.description,
      quantityProduct: oldProduct.quantity,
      maxProductOrder: oldProduct.maxOrder,
      categoryID: oldProduct.categoryId._id,
      isDiscountProduct: oldProduct.isSale,
      discountNumber: oldProduct.sale,
      showSuccessMessage: false,
      processing: false,
      oldProduct: oldProduct
    });
  }

  _editProduct() {
    let productEdited = Object.assign({}, this.state.oldProduct);
    productEdited.name = this.state.productName;
    productEdited.price = this.state.productPrice;
    productEdited.description = this.state.productDescription;
    productEdited.maxOrder = this.state.maxProductOrder;
    productEdited.quantity = this.state.quantityProduct;
    productEdited.categoryId = this.state.categoryID;
    productEdited.isSale = this.state.isDiscountProduct;
    productEdited.sale = this.state.discountNumber;

    this.setState({ processing: true, showSuccessMessage: false }, () => {
      editProduct(productEdited._id, productEdited, "edit")
        .then(productUpdate => {
          if (productUpdate.data.data.ok === 1) {
            let listProduct = Object.assign([], this.state.listProduct);
            listProduct.forEach((product, index) => {
              if (productEdited._id === product._id) {
                listProduct[index] = productEdited;
              }
            });
            this.setState(
              {
                listProduct: listProduct,
                isEditProduct: false,
                productName: "",
                productPrice: "",
                productDescription: "",
                quantityProduct: "",
                maxProductOrder: "",
                categoryID: "",
                processing: false
              },
              () => {
                ToastsStore.success("Thêm category thành công");
              }
            );
          } else {
            ToastsStore.error("Có lỗi xảy ra, hãy thử lại !");
          }
        })
        .catch(err => {
          console.log(err);
          ToastsStore.error("Có lỗi xảy ra, hãy thử lại !");
        });
    });
  }

  _deleteProduct(productDel) {
    let productEdited = Object.assign({}, productDel);

    this.setState({ processing: true, showSuccessMessage: false }, () => {
      editProduct(productEdited._id, productEdited, "delete")
        .then(productDelete => {
          if (productDelete.data.data.ok === 1) {
            let listProduct = Object.assign([], this.state.listProduct);
            listProduct.forEach((product, index) => {
              if (productEdited._id === product._id) {
                listProduct.splice(index, 1);
              }
            });
            this.setState(
              {
                listProduct: listProduct,
                isEditProduct: false,
                productName: "",
                productPrice: "",
                productDescription: "",
                quantityProduct: "",
                maxProductOrder: "",
                categoryID: "",
                processing: false
              },
              () => {
                ToastsStore.success("Xóa sản phẩm thành công");
              }
            );
          } else {
            ToastsStore.error("Có lỗi xảy ra, hãy thử lại !");
          }
        })
        .catch(err => {
          console.log(err);
          ToastsStore.error("Có lỗi xảy ra, hãy thử lại !");
        });
    });
  }

  render() {
    return (
      <div className="Profile-component">
        <ToastsContainer
          store={ToastsStore}
          position={ToastsContainerPosition.TOP_RIGHT}
        />

        <div className="container-login100 Profile">
          <Row className="d-flex">
            <Col
              xs={12}
              sm={4}
              md={4}
              lg={3}
              className={
                "col-padding-top " +
                (this.state.isEditProduct === true
                  ? "edit-product-col-left"
                  : "")
              }
            >
              <div className="tab-add-category">
                <p
                  className={
                    "title-tab position-relative " +
                    (this.state.isEditProduct ? "title-tab-edit" : "")
                  }
                >
                  {this.state.isEditProduct == true
                    ? "SỬA SẢN PHẨM"
                    : "THÊM MỚI SẢN PHẨM"}
                  <Button
                    className={
                      this.state.isEditProduct === true
                        ? "button-exit"
                        : "display-none"
                    }
                    onClick={this._closeEdit.bind(this)}
                  >
                    <i className="fas fa-times" />
                  </Button>
                </p>
                <p className="sub-title"> Tên sản phẩm</p>
                <input
                  className="input-style"
                  type="text"
                  value={this.state.productName}
                  onFocus={() => {
                    this.setState({ showSuccessMessage: false });
                  }}
                  onChange={productName => {
                    this.setState({ productName: productName.target.value });
                  }}
                  name="category-name"
                />
                {/* Giá sản phẩm */}
                <p className="sub-title">
                  {" "}
                  Giá sản phẩm{" "}
                  <span className="text-primary">( vd: 10000đ )</span>
                </p>

                <input
                  className="input-style input-style-currence"
                  type="text"
                  placeholder="đ"
                  value={this.state.productPrice}
                  onFocus={() => {
                    this.setState({
                      showSuccessMessage: false,
                      inputPriceFocus: true
                    });
                  }}
                  onBlur={() => {
                    this.setState({ inputPriceLostFocus: true });
                  }}
                  onChange={productPrice => {
                    this.setState({ productPrice: productPrice.target.value });
                  }}
                  name="category-name"
                />
                <div
                  className={
                    "text-danger " +
                    (this.state.inputPriceFocus === true &&
                    this.state.inputPriceLostFocus === true &&
                    _validateNumber(this.state.productPrice) === false
                      ? "Display-block"
                      : "Display-none")
                  }
                >
                  Bạn phải nhập đúng định dạng tiền
                </div>

                {/* Mô tả sản phẩm */}
                <p className="sub-title"> Mô tả sản phẩm</p>

                <textarea
                  className="input-style textarea-min-height"
                  rows="4"
                  cols="50"
                  value={this.state.productDescription}
                  onFocus={() => {
                    this.setState({ showSuccessMessage: false });
                  }}
                  onChange={productDes => {
                    this.setState({
                      productDescription: productDes.target.value
                    });
                  }}
                />

                <p className="sub-title">
                  Số lượng tối đa cho phép đặt mỗi lần
                </p>
                <input
                  className="input-style"
                  type="text"
                  value={this.state.maxProductOrder}
                  onFocus={() => {
                    this.setState({
                      showSuccessMessage: false,
                      inputMaxOrderFocus: true
                    });
                  }}
                  onBlur={() => {
                    this.setState({ inputMaxOrderLostFocus: true });
                  }}
                  onChange={maxOrder => {
                    this.setState({ maxProductOrder: maxOrder.target.value });
                  }}
                  name="category-name"
                />
                <div
                  className={
                    "text-danger " +
                    (this.state.inputMaxOrderLostFocus === true &&
                    this.state.inputMaxOrderFocus === true &&
                    _validateNumber(this.state.maxProductOrder) === false
                      ? "Display-block"
                      : "Display-none")
                  }
                >
                  Bạn phải nhập đúng định dạng số
                </div>

                <p className="sub-title"> Số sản phẩm bán</p>
                <input
                  className="input-style"
                  type="text"
                  value={this.state.quantityProduct}
                  onFocus={() => {
                    this.setState({
                      showSuccessMessage: false,
                      inputQuantityOrderFocus: true
                    });
                  }}
                  onBlur={() => {
                    this.setState({ inputQuantityOrderLostFocus: true });
                  }}
                  onChange={slProduct => {
                    this.setState({ quantityProduct: slProduct.target.value });
                  }}
                  name="category-name"
                />
                <div
                  className={
                    "text-danger " +
                    (this.state.inputQuantityOrderLostFocus === true &&
                    this.state.inputQuantityOrderFocus === true &&
                    _validateNumber(this.state.quantityProduct) === false
                      ? "Display-block"
                      : "Display-none")
                  }
                >
                  Bạn phải nhập đúng định dạng só
                </div>

                <p className="sub-title"> Category cha</p>
                <select
                  value={this.state.categoryID}
                  className="input-style"
                  onChange={parentId =>
                    this.setState({
                      categoryID: parentId.target.value
                    })
                  }
                >
                  <option key="no-parent" value="">
                    Không có
                  </option>
                  {this.state.listCategory.length > 0 ? (
                    this._renderSelectCategory(this.state.listCategory)
                  ) : (
                    <option className="text-danger">Lỗi load data</option>
                  )}
                </select>
                {/* <p className="note-select">
                  Không có: Sản phẩm không thuộc Category nào.
                </p> */}
                <p className="sub-title" />
                <div className="check-isShow">
                  <input
                    name="isDiscountProduct"
                    type="checkbox"
                    checked={this.state.isDiscountProduct}
                    onChange={() =>
                      this.setState({
                        isDiscountProduct: !this.state.isDiscountProduct
                      })
                    }
                  />
                  <span>Có giảm giá</span>
                  <div className= { "discount " + (this.state.isDiscountProduct == true ? "": "display-none")}>
                    <input
                      className="input-style input-discount"
                      type="text"
                      value={this.state.discountNumber}
                      onFocus={() => {
                        this.setState({
                          showSuccessMessage: false,
                          inputDiscountOrderFocus: true
                        });
                      }}
                      onBlur={() => {
                        this.setState({ inputDiscountOrderLostFocus: true });
                      }}
                      onChange={discount => {
                        this.setState({
                          discountNumber: discount.target.value
                        });
                      }}
                      name="category-name"
                    />
                    <span className="systax-percent">%</span>
                  </div>
                </div>
                <div
                  className={
                    "text-danger m-t-15px " +
                    (this.state.inputDiscountOrderLostFocus === true &&
                    this.state.inputDiscountOrderFocus === true &&
                    _validateNumber(this.state.discountNumber) === false
                      ? "Display-block"
                      : "Display-none")
                  }
                >
                  Bạn phải nhập đúng định dạng số
                </div>
                <div>
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
                      "button-add " +
                      (this.state.isEditProduct ? "display-none" : "")
                    }
                    disabled={
                      this.state.processing === true ||
                      this.state.productName === "" || 
                      this.state.productPrice === "" || 
                      this.state.productDescription === "" || 
                      this.state.maxProductOrder === "" || 
                      this.state.quantityProduct === "" || 
                      this.state.isDiscountProduct === "" || 
                      this.state.discountNumber === ""  ||
                      _validateNumber(this.state.discountNumber) === false ||
                      _validateNumber(this.state.maxProductOrder) === false ||
                      _validateNumber(this.state.productPrice) === false ||
                      _validateNumber(this.state.quantityProduct) === false
                    }
                    onClick={this._addNewProduct.bind(this)}
                  >
                    Thêm mới
                  </button>

                  <button
                    className={
                      "button-add " +
                      (this.state.isEditProduct ? "" : "display-none")
                    }
                    disabled={this.state.processing}
                    onClick={this._editProduct.bind(this)}
                  >
                    Lưu thay đổi
                  </button>
                </div>
              </div>
            </Col>

            <Col
              xs={12}
              sm={8}
              md={8}
              lg={9}
              className={
                "col-padding-top " +
                (this.state.isEditProduct === true
                  ? "edit-product-col-right"
                  : "")
              }
            >
              <div className="tab-list-category">
                <p className="title-tab">Danh sách sản phẩm</p>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Tên</th>
                      <th>Mô tả </th>
                      <th>Giá</th>
                      <th>Số SP đang bán</th>
                      <th>Số SP / 1 lần mua</th>
                      <th>Sale (%)</th>
                      <th>Chỉnh sửa</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this._renderListProduct(this.state.listProduct)}
                  </tbody>
                </Table>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default ManageProductComponent;
