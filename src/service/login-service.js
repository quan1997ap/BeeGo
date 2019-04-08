import axios from 'axios';
import { rootPath } from '../configs/enviroment';

export function LoginService(dataLogin){
   return axios.post(`${rootPath}/api/login/`,{
    email : dataLogin.email,
    password : dataLogin.password,
    type : dataLogin.type
  })
} 
