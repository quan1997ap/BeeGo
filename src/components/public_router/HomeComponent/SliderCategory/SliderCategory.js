import React from "react";
import Slider from "react-slick";
import "./SliderCategory.css";
import { getAllCategoryHomePage } from "../../../../service/customer-service";

export class SliderCategory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listCategory: []
    };
  }
  componentDidMount() {
    getAllCategoryHomePage().then(categoris => {
      this.setState({ listCategory: categoris.data }, () => {
        // console.log(this.state.listCategory);
      });
    });
  }

  _renderListCategory(listCategory) {
    let listItemCategory = listCategory.map(category => (
      <div className="cartItemCover" key = {category._id}>
        <div className="squareCartItem">
          <div className="crop-category">
            <img
              className="category-img"
              alt = {category.name}
              src={require("../../../../assets/image/product.jpg")}
            />
          </div>
          <p className="category-title">{category.name}</p>
        </div>
      </div>
    ));
    return listItemCategory;
  }

  render() {
    const settings = {
      infinite: false,
      speed: 1000,
      slidesToShow: 8,
      slidesToScroll: 4,
      dots: false
    };
    return (
      <div className="full-width">
        <p className="title-slider-category">Danh mục sản phẩm</p>
        <Slider {...settings}>
          {this._renderListCategory(this.state.listCategory)}
        </Slider>
      </div>
    );
  }
}
