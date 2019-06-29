import "../../../../styles/mainconfig.css";
import React, { Component } from "react";
import { Row, Col, Button, Table, Modal, Dialog } from "react-bootstrap";
import "./CategorisComponent.css";
import Spinner from "react-spinner-material";
import {
  ToastsContainer,
  ToastsStore,
  ToastsContainerPosition
} from "react-toasts";
import { getALLCategoryForProvider } from "../../../../service/provider-service";

// y tưởng :
// Dùng phương pháp đệ quy => biến đổi từ mảng chứa tất cả các category => mảng Lồng nhau(cha chứa con)
// Nội suy để render ra select và ra div
// addNew thành công => render lại chứ k tại lại dữ liệu => sẽ có 3 mảng lưu dữ liệu
// listSourceCategory : danh sách category lần đầu tải về
// listRootCategoryc : các category cấp cao nhất
// listCategory : danh sách category đã đc đệ quy => xử lý để hiển thị

class CategorisComponent extends Component {
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
    getALLCategoryForProvider()
      .then(arrListCategory => {
        if (arrListCategory && arrListCategory.data.length > 0) {
          let listSourceCategory = Object.assign([], arrListCategory.data);
          let listRootCategory = listSourceCategory.filter(
            category => category.parentId == null
          );
          this.setState(
            {
              listSourceCategory: listSourceCategory,
              listRootCategory: listRootCategory
            },
            () => {
              let convertDataListCategory = this._interpolationListCategory(
                listSourceCategory,
                listRootCategory,
                0
              );
              this.setState({ listCategory: convertDataListCategory });
            }
          );
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
            <div className="div-lever-col-3 text-center">
              {/* {itemCategory.isShow !== null ? itemCategory.isShow.toString() : "null"} */}
              <i
                className={
                  "fa fa-lock text-danger " +
                  (itemCategory.isShow === true ? "d-none" : "")
                }
                aria-hidden="true"
              />
              <i
                className={
                  "fa fa-unlock-alt text-success " +
                  (itemCategory.isShow === true ? "" : "d-none")
                }
                aria-hidden="true"
              />
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

  render() {
    return (
      <div className="Profile-component">
        <ToastsContainer
          store={ToastsStore}
          position={ToastsContainerPosition.TOP_RIGHT}
        />

        <div className="container-login100 Profile">
          <Row>
            <Col
              xs={12}
              sm={12}
              md={12}
              lg={12}
              className={
                "col-padding-top " +
                (this.state.editCategory === true ? "d-none" : "")
              }
            >
              <div className="tab-list-category">
                <p className="title-tab">Danh sách Category</p>
                <div>
                  <div className="div-lever">
                    <div className="width-365px"> Tên Category </div>
                    <div className="div-lever-col-2"> Category ID</div>
                    <div className="div-lever-col-3"> Status </div>
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

export default CategorisComponent;
