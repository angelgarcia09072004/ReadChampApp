import axios from 'axios';

const API = axios.create({
  baseURL: 'http://192.168.8.41:8000/api', 
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});


