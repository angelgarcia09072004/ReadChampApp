import axios from 'axios';

const API = axios.create({
   //baseURL: 'http://172.20.10.2/api',
     baseURL: 'http://192.168.8.33:8000/api', 
   //baseURL: 'http://10.33.204.194:8000/api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export default API;
