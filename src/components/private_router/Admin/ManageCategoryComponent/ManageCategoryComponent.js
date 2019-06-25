import "../../../../styles/mainconfig.css";
import React, { Component } from "react";
import { Row, Col, Button, Table, Modal, Dialog } from "react-bootstrap";
import "./ManageCategoryComponent.css";
import cancelRequest, {
  // getListCategoryWithPermision,
  addNewCategoryWithPermision,
  getALLCategory,
  editCategory
} from "../../../../service/admin-service";
import Spinner from "react-spinner-material";
import {
  ToastsContainer,
  ToastsStore,
  ToastsContainerPosition
} from "react-toasts";
import { CategoryInfoModel } from "../../../../model/categoryinfo.model";
import axios from "axios";
import ReadMoreReact from 'read-more-react';

// y tưởng :
// Dùng phương pháp đệ quy => biến đổi từ mảng chứa tất cả các category => mảng Lồng nhau(cha chứa con)
// Nội suy để render ra select và ra div
// addNew thành công => render lại chứ k tại lại dữ liệu => sẽ có 3 mảng lưu dữ liệu
// listSourceCategory : danh sách category lần đầu tải về
// listRootCategoryc : các category cấp cao nhất
// listCategory : danh sách category đã đc đệ quy => xử lý để hiển thị

class ManageCategoryComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errGetCategory: {},
      listCategory: [],
      listSourceCategory: [],
      listRootCategory: [],
      isShowCategory: true,
      categoryName: "",
      parentCategoryID: "",
      processing: false,
      addSuccess: false,
      showSuccessMessage: false,
      editCategory: false,
      categoryIdEdit: ""
    };
  }

  componentWillMount() {
    this._getListCategoryWithPermision();
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
    getALLCategory()
    .then(arrListCategory => {
      if (arrListCategory && arrListCategory.data.length > 0 ){
        let listSourceCategory = Object.assign([], arrListCategory.data );
        let listRootCategory = listSourceCategory.filter(category => category.parentId == null);
        this.setState({
          listSourceCategory: listSourceCategory,
          listRootCategory: listRootCategory
        }, () =>{
          let convertDataListCategory = this._interpolationListCategory(
            listSourceCategory,
            listRootCategory,
            0
          );
          this.setState({ listCategory: convertDataListCategory });
        });
      }
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


  _renderListCategory(listCategory) {
    // nội suy để tạo table các category
    let listCategoryDetail;
    if (listCategory.length > 0) {
      listCategoryDetail = listCategory.map((itemCategory, index) => {
        // chèn thêm 1 dấu cách vào trước option
        let listCategoryDetailTG = (
          <div
            key={"level-" + itemCategory._id}
            className={"div-lever div-level-" + itemCategory.level}
          >
            {/* <div> <ReadMoreReact min={20}  max={100} readMoreText={"xem thêm"} text={itemCategory.name} /> </div> */}
            <div> {itemCategory.name} </div>
            <div className="div-lever-col-2"> {itemCategory._id}</div>
            <div className="div-lever-col-3">
              {" "}
              {itemCategory.isShow.toString()}
            </div>
            <div>
              <Button className="edit-button" onClick={this._openEdit.bind(this,itemCategory._id, itemCategory.name, itemCategory.parentId )}>Edit</Button>
              <Button className="delete-button">Del</Button>
            </div>
          </div>
        );

        // nội suy
        if (itemCategory.child !== undefined && itemCategory.child.length > 0) {
          listCategoryDetailTG = [
            listCategoryDetailTG,
            this._renderListCategory(itemCategory.child)
          ];
          return listCategoryDetailTG;
        } else {
          return listCategoryDetailTG;
        }
      });
    }
    return listCategoryDetail;
  }

  _addNewCategory() {

    this.setState({ processing: true, showSuccessMessage: false }, () => {
      let newCategory = new CategoryInfoModel();
      newCategory.name = this.state.categoryName;
      newCategory.isShow = this.state.isShowCategory;
      newCategory.parentId = this.state.parentCategoryID;
      addNewCategoryWithPermision(newCategory)
        .then(resData => {
          if (resData.data.message === "Add category success") {
            
            if (newCategory._id !== null && newCategory.parentId !== "") {
              this.setState(
                { 
                  listSourceCategory: this.state.listSourceCategory.concat([
                    {
                      parentId: {
                        parentId:
                          this.state.parentCategoryID !== ""
                            ? this.state.parentCategoryID
                            : null,
                        _id:
                          this.state.parentCategoryID !== ""
                            ? this.state.parentCategoryID
                            : null,
                        name: ""
                      },
                      _id: resData.data.data._id,
                      name: resData.data.data.name,
                      isShow: resData.data.data.isShow,
                      __v: 0
                    }
                  ])
                },
                () => {
                  // them moi va cap nhat lai
                  let convertDataListCategory = this._interpolationListCategory(
                    this.state.listSourceCategory,
                    this.state.listRootCategory,
                    0
                  );
                  this.setState(
                    {
                      categoryName: "",
                      addSuccess: true,
                      showSuccessMessage: true,
                      listCategory: convertDataListCategory,
                      processing: false
                    },
                    () => {
                      ToastsStore.success("Thêm category thành công");
                    }
                  );
                }
              );
            } else if (newCategory.parentId === "") {
              this.setState({ processing: true });
              this.setState(
                {
                  listRootCategory: this.state.listRootCategory.concat([
                    {
                      parentId: null,
                      _id: resData.data.data._id,
                      name: resData.data.data.name,
                      isShow: resData.data.data.isShow,
                      __v: 0
                    }
                  ])
                },
                () => {
                  // them moi va cap nhat lai nếu là category root
                  let convertDataListCategory = this._interpolationListCategory(
                    this.state.listSourceCategory,
                    this.state.listRootCategory,
                    0
                  );
                  this.setState(
                    {
                      categoryName: "",
                      addSuccess: true,
                      showSuccessMessage: true,
                      listCategory: convertDataListCategory,
                      processing: false
                    },
                    () => {
                      ToastsStore.success("Thêm category thành công");
                    }
                  );
                }
              );
            }
          }
        })
        .catch(errData => {
          this.setState({ processing: false, addSuccess: false, showSuccessMessage: false });
          ToastsStore.error("Có lỗi xảy ra, hãy thử lại !");
          console.log(errData);
        });
    });

  }

  _editCategory(){
    console.log(this.state.categoryIdEdit, this.state.categoryName, this.state.parentCategoryID)
    let categoryEdited = {_id : this.state.categoryIdEdit , parentId: this.state.parentCategoryID !== ""  ? this.state.parentCategoryID : null , name:this.state.categoryName , isShow: true }
    this.setState({ processing: true, showSuccessMessage: false }, () => {
      editCategory(categoryEdited).then(
        resEditCategory =>{
          if (resEditCategory && resEditCategory.data.ok === 1){
            ToastsStore.success("Sửa category thành công");
            this._getListCategoryWithPermision();
            this.setState({
              processing: false,
              editCategory: false,
              categoryName : "",
              parentCategoryID :  "",
              categoryIdEdit: ""
            })
          }
          else{
            ToastsStore.error("Có lỗi xảy ra, hãy thử lại !");
          }
        }
      )
    })
  }

  _closeEdit(){
    this.setState({
      editCategory: false,
      categoryName : "",
      parentCategoryID :  "",
      categoryIdEdit: ""
    })
  }

  _openEdit(id , name, parentId){
    this.setState({
      editCategory: true,
      categoryName : name,
      parentCategoryID : parentId ? parentId._id : "",
      categoryIdEdit: id
    })
  }
  
  render() {
    return (
      <div className="Profile-component">
        <ToastsContainer
          store={ToastsStore}
          position={ToastsContainerPosition.TOP_RIGHT}
        />

        <div className="container-login100 Profile">
          <Row>
            <Col xs={12} sm={4} md={4} lg={3} className={"col-padding-top " + (this.state.editCategory === true ? "editCategory" : "" )}>
              <div className="tab-add-category">
                <p className="title-tab"> {this.state.editCategory === false ? "Thêm mới Category" : "Sửa Category"}
                  <Button
                      className={
                        this.state.editCategory === true
                          ? "button-exit"
                          : "display-none"
                      }
                      onClick={this._closeEdit.bind(this)}
                    >
                      <i className="fas fa-times" />
                  </Button>
                </p>
                <p className="sub-title"> Tên category</p>
                <input
                  className="input-style"
                  type="text"
                  defaultValue={this.state.categoryName}
                  onFocus = { () => {this.setState( {showSuccessMessage : false})}}
                  onBlur={categoryName => {
                    this.setState({ categoryName: categoryName.target.value });
                  }}
                  name="category-name"
                />
                <p className="sub-title"> Category cha</p>
                <select
                  className="input-style"
                  value= {this.state.parentCategoryID}
                  onChange={parentId =>
                    this.setState({ parentCategoryID: parentId.target.value }, () => {console.log('a',this.state.parentCategoryID)})
                  }
                >
                  <option key="no-parent" value= "">
                    Không có
                  </option>
                  {this.state.listCategory.length > 0 ? (
                    this._renderSelectCategory(this.state.listCategory)
                  ) : (
                    <option className="text-danger">Lỗi load data</option>
                  )}
                </select>
                <p className="note-select">
                  Không có Category Cha : Category Gốc
                </p>
                <p className="sub-title">Trạng thái</p>
                <div className="check-isShow">
                  <input
                    name="isShowCategory"
                    type="checkbox"
                    checked={this.state.isShowCategory}
                    onChange={() =>
                      this.setState(
                        {
                          isShowCategory: !this.state.isShowCategory
                        },
                        () => {
                          console.log(this.state.isShowCategory);
                        }
                      )
                    }
                  />
                  <span>Cho phép sử dụng category</span>
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
                      (this.state.processing === false && this.state.showSuccessMessage === true
                        ? "block"
                        : "display-none") +
                      (this.state.addSuccess === true ? " SUCCESS" : " FAIL")
                    }
                  >
                    <i className= {(this.state.addSuccess === true ? "far fa-check-circle" : "far fa-times-circle")}></i>
                    <span> {this.state.addSuccess === true ? "Thành công" : "Thất bại"} </span>
                  </div>

                  <button
                    className= {this.state.editCategory === true  ? "d-none" : "button-add"}
                    disabled={this.setState.processing}
                    onClick={this._addNewCategory.bind(this)}
                  >
                    {this.state.processing === true ? "Đang thêm ..." :"Thêm mới"}
                  </button>

                  <button
                    className= {this.state.editCategory === true ? "button-add" : "d-none"}
                    disabled={this.setState.processing}
                    onClick={this._editCategory.bind(this)}
                  >
                    {this.state.processing === true ? "Đang sửa ..." :"Sửa"}
                  </button>
                  
                </div>
              </div>
            </Col>

            <Col xs={12} sm={8} md={8} lg={9} className={"col-padding-top " + (this.state.editCategory === true ? "d-none" : "" )}>
              <div className="tab-list-category">
                <p className="title-tab">Danh sách Category</p>
                <div>
                  <div className="div-lever">
                    <div className="width-365px"> Tên Category </div>
                    <div className="div-lever-col-2"> Category ID</div>
                    <div className="div-lever-col-3"> Status </div>
                    <div className="div-lever-col-4"> Thay đổi </div>
                  </div>
                  {this._renderListCategory(this.state.listCategory)}
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default ManageCategoryComponent;
