import axios from 'axios';
import { rootPath } from '../configs/enviroment';

export function getListUserWithPermision(accessToken, permission){
  axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}` 
  return axios.get(`${rootPath}/api/admin/user/list/${permission}-0-10`);
} 

export function blockUserService(accessToken, userID){
  axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}` 
  return axios.get(`${rootPath}/api/admin/user/block/${userID}`);
} 

export function unblockUserService(accessToken, userID){
  axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}` 
  return axios.get(`${rootPath}/api/admin/user/unblock/${userID}`);
} 

