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
  return http.get(`${rootPath}/api/product/list?sort=&category=${categoryID}`,{
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