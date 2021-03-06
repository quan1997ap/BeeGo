import React, { Component } from "react";
import "./SearchComponent.css";
import "../HomeComponent/ProductList/ProductList.css";
import { Row, Col, Button } from "react-bootstrap";
import { SearchProductByName } from "../../../service/general-service";
import queryString from "query-string";
import { addItemsToCart } from "../../../service/cart-service";
import {
  ToastsContainer,
  ToastsStore,
  ToastsContainerPosition
} from "react-toasts";

class SearchComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productList: [],
      categoryName: "",
      noResult: false,
      searching: false
    };
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
    addItemsToCart(data)
      .then(data => {
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
              <img
                src={
                  product.images && product.images[0]
                    ? "http://food.negoo.tk/api/file?filename=" +
                      product.images[0]
                    : require("../../../assets/image/product.jpg")
                }
              />
            </div>
            <p className="name-product">{this._sliceText(product.name, 56)}</p>

            <div>
              <span className="cost"> Giá: {product.price}đ</span>
              <span className="sell-number"> {product.ordered} đã bán</span>
            </div>
          </div>
          <div
            className="add-to-cart"
            onClick={this._addProductToCart.bind(this, product._id)}
          >
            Mua ngay
            <img
              src={require("../../../assets/image/icon/add-cart.jpg")}
              className="icon-cart"
            />
          </div>
        </div>
      </Col>
    ));
    return productList;
  }

  _searchProductByName(name) {
    this.setState({ noResult: false, searching: true }, () => {
      SearchProductByName(name)
        .then(searchRes => {
          console.log(this.state.productList);
          if (searchRes && searchRes.data && searchRes.data.length > 0) {
            this.setState(
              {
                productList: searchRes.data,
                noResult: false,
                searching: false
              },
              () => {
                console.log(this.state.productList);
              }
            );
          } else if (
            searchRes &&
            searchRes.data &&
            searchRes.data.length === 0
          ) {
            this.setState({ noResult: true, searching: false });
          }
        })
        .catch(e => {
          console.log(e);
          this.setState({ noResult: true, searching: false });
        });
    });
  }

  componentDidMount() {
    let searchText = queryString.parse(this.props.location.search).search;
    this._searchProductByName(searchText);
  }

  componentDidUpdate(prevProps, prevState) {
    let searchText = queryString.parse(this.props.location.search).search;
    if (this.props.location.search !== prevProps.location.search) {
      this._searchProductByName(searchText);
      console.log("vao", searchText);
    } else {
      console.log("Đang tìm lại cái cũ");
    }
  }

  render() {
    return (
      <div className="container-custom search-component">
        <div className="user-card">
          <p className="cart-name">Kết quả tìm kiếm</p>
          <Row>{this.renderListProduct()}</Row>
          <div className={this.state.searching === true ? "" : "d-none"}>
            <h3> Đang tìm kiếm ... </h3>
          </div>
          <p className={this.state.noResult === true ? "" : "d-none"}>
            {" "}
            Không có kết quả nào phù hợp{" "}
          </p>
        </div>
      </div>
    );
  }
}

export default SearchComponent;
