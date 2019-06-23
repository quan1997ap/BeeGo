import { rootPath } from '../configs/enviroment';
import http  from './interceptors';
import axios from 'axios';

const CancelToken = axios.CancelToken;
let cancel;

// manage Product

export function getAllProductOfProvider(){
  return http.get(`${rootPath}/api/provider/product/list`,{
    cancelToken: new CancelToken(function executor(c) {
      cancel = c;
    })
  });
} 

export function addNewProduct(newProduct){
  return http.post(`${rootPath}/api/provider/product/add`,newProduct ,{
    cancelToken: new CancelToken(function executor(c) {
      cancel = c;
    })
  });
} 

export function editProduct(productId,productEdited, actionName){
  console.log(productId)
  if (actionName === "edit"){
    return http.post(`${rootPath}/api//provider/product/edit/${productId}`,productEdited ,{
      cancelToken: new CancelToken(function executor(c) {
        cancel = c;
      })
    });
  }
  else if (actionName === "delete"){
    productEdited.isShow = false;
    return http.post(`${rootPath}/api//provider/product/edit/${productId}`,productEdited ,{
      cancelToken: new CancelToken(function executor(c) {
        cancel = c;
      })
    });
  }
} 

// cancel Request
export default function cancelRequest() {
  cancel();
}


// an 5cc6a0d61ec84a233589994f
// gia dung 5cc5c125816c137d55a9428a