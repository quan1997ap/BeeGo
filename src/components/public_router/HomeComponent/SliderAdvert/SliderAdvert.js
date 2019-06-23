import React from "react";
import Slider from "react-slick";
import "./SliderAdvert.css";
import { Row, Col, Button } from "react-bootstrap";

export class SliderAdvert extends React.Component {
  render() {
    const settings = {
      infinite: true,
      speed: 1000,
      slidesToShow: 1,
      slidesToScroll: 1
    };
    return (
      <div className="full-width">
        {/* <p className="title-slider-category">Danh mục sản phẩm</p> */}
        <br/>
        <Row className="no-margin">
          <Col xs={12} sm={12} md={12} lg={12} className="no-padding">
            <Slider {...settings}>
              <div className="cartItem">
                <img src={require("../../../../assets/image/advert1.jpg")} />
              </div>
              <div className="cartItem">
                <img src={require("../../../../assets/image/advert2.jpg")} />
              </div>
              <div className="cartItem">
                <img src={require("../../../../assets/image/advert2.jpg")} />
              </div>
            </Slider>
          </Col>
        </Row>
      </div>
    );
  }
}
