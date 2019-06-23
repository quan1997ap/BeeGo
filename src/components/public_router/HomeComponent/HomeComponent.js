import React, { Component } from "react";
import { SliderCategory } from "./SliderCategory/SliderCategory";
import "./HomeComponent.css";
import { SliderAdvert } from "./SliderAdvert/SliderAdvert";
import { getAllCategoryHomePage } from "../../../service/customer-service";
import { ProductList } from "./ProductList/ProductList";

export class HomeComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      listCategoryId : [],
      listCategory: []
    }
  }

  componentDidMount(){
    getAllCategoryHomePage().then(categoris => {
      this.setState({ listCategory: categoris.data }, () => {
         let listCategoryId = [];
         this.state.listCategory.forEach( (category, index) =>{
           if (index < 5){
            listCategoryId.push(category._id)
           }
           this.setState({listCategoryId:listCategoryId});
         })
      });
    });
  } 

  renderListProduct(){
    let listCategoryId = Object.assign([], this.state.listCategoryId);
    let productList = listCategoryId.map( (categoryID , index) => (
      <ProductList key={index} categoryID = {categoryID}/>
    ));
    return productList;
  }

  render() {
    return (
      <div className="Home-component">
          <div
            className="container-home"
          >
            <SliderAdvert />
            <SliderCategory />
            {this.renderListProduct()}
          </div>
 
      </div>
    );
  }
}

export default HomeComponent;
