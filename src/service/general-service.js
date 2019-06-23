import { rootPath } from '../configs/enviroment';
import http  from './interceptors';
import axios from 'axios';

const CancelToken = axios.CancelToken;
let cancel;

// manage Product

export function getUserInfo(){
  return http.get(`${rootPath}/api/token/info`,{
    cancelToken: new CancelToken(function executor(c) {
      cancel = c;
    })
  });
} 

export function SearchProductByName(productName){
  return http.get(`${rootPath}/api/product/list?name=${productName}`,{
    cancelToken: new CancelToken(function executor(c) {
      cancel = c;
    })
  });
} 

