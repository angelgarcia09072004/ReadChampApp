import axios from 'axios';

const API = axios.create({
  
  baseURL: 'http://10.0.2.2:8000/api', 
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export default API;

