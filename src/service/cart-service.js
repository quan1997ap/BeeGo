import { rootPath } from '../configs/enviroment';
import http from './interceptors';
import axios from 'axios';

const CancelToken = axios.CancelToken;
let cancel;

let baseUrl = `${rootPath}/api/customer/cart`;

export function getCartItems() {
    return http.get(baseUrl, {
        cancelToken: new CancelToken(function executor(c) {
            cancel = c;
        })
    });
}

export function addItemsToCart(items) {
    return http.post(baseUrl + '/add-product', items);
}

export function deleteItemInCart(items) {
    return http.post(baseUrl +  '/remove-product', items);
}

export function getPayments() {
    return http.get(`${rootPath}/api/customer/payment/list`);
}

export function payBill(items) {
    return http.get(baseUrl);
}