import React from "react";
import Slider from "react-slick";
import "./ProductList.css";
import { Row, Col, Button } from "react-bootstrap";
// import ReadMoreReact from "./node_modules/read-more-react";
import { getProductByCategoryId } from "../../../../service/customer-service";
import { addItemsToCart } from "../../../../service/cart-service";
import { withRouter } from 'react-router-dom';
import {
  ToastsContainer,
  ToastsStore,
  ToastsContainerPosition
} from "react-toasts";

class _ProductList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      productList: [],
      categoryName: ""
    };
  }

  componentDidMount() {
    getProductByCategoryId(this.props.categoryID).then(resProducts => {
      if (resProducts.data.length > 0) {
        this.setState({ productList: resProducts.data, categoryName: resProducts.data[0].category }, () => {
          console.log(this.state.productList);
        });
      }
    });
  }

  _sliceText(text, max) {
    if (text.length > max) {
      return text.slice(0, max) + "...";
    } else {
      return text;
    }
  }

  _addProductToCart(id) {
    let data = {
      products: [id]
    };
    console.log(data)
    addItemsToCart(data)
      .then(data => {
        console.log(data)
        this.props.history.push({
          pathname: 'customer/list-product-of-user',
          search: "?" + new URLSearchParams({ search: this.state.searchText }).toString(),
          itemsId: id
        })
      })
      .catch(error => ToastsStore.error("Có khi thêm hàng vào giỏ, hãy thử lại !"));

  }

  renderListProduct() {
    let productList = this.state.productList.map((product, index) => (
      <Col xs={12} sm={6} md={4} lg={3} className="no-padding" key={index}>
        <div className="cartProductCover">
          <div className="cartProduct">
            <div className="crop">
              <img src={require("../../../../assets/image/product.jpg")} />
            </div>
            <p className="name-product">
              {this._sliceText(this.state.productList[index].name, 56)}
            </p>

            <div>
              <span className="cost"> Giá: {this.state.productList[index].price}đ</span>
              <span className="sell-number"> {this.state.productList[index].ordered} đã bán</span>
            </div>
          </div>
          <div className="add-to-cart" onClick={this._addProductToCart.bind(this, product._id)}>
            Mua ngay
            <img src={require("../../../../assets/image/icon/add-cart.jpg")} className="icon-cart" />
          </div>
        </div>
      </Col>
    ));
    return productList;
  }

  render() {
    return (
      <div className="full-width">
        <ToastsContainer
          store={ToastsStore}
          position={ToastsContainerPosition.TOP_RIGHT}
        />
        <p className="title-slider-category">{this.state.categoryName}</p>
        <Row className="no-margin" >
          {this.renderListProduct()}
        </Row>
      </div>
    );
  }
}

export const ProductList = withRouter(_ProductList);