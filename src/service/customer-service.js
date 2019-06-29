import { rootPath } from '../configs/enviroment';
import http  from './interceptors';
import axios from 'axios';

const CancelToken = axios.CancelToken;
let cancel;

// manage Product

export function getAllCategoryHomePage(){
  return http.get(`${rootPath}/api/category/list`,{
    cancelToken: new CancelToken(function executor(c) {
      cancel = c;
    })
  });
} 

export function getProductByCategoryId(categoryID){
  return http.get(`${rootPath}/api/product/list?category=${categoryID}`,{
    cancelToken: new CancelToken(function executor(c) {
      cancel = c;
    })
  });
} 

export function getCart(){
  return http.get(`${rootPath}/api/customer/cart`,{
    cancelToken: new CancelToken(function executor(c) {
      cancel = c;
    })
  });
} 

export function getAllOrderForCustomer(){
  return http.get(`${rootPath}/api/customer/order/list`);
} 

// xác nhận đã nhận hàng

export function orderSuccess(orderInfo){
  return http.put(`${rootPath}/api/customer/order/success`, orderInfo,{
    cancelToken: new CancelToken(function executor(c) {
      cancel = c;
    })
  });
}

export function getCustomerInfo(){
  return http.get(`${rootPath}/api/token/info`);
} 
