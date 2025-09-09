import axios from 'axios';

const request = axios.create({
  baseURL: process.env.REACT_APP_API_URI,
  headers: {
      'content-type':'application/json'
  },
  timeout: process.env.REACT_APP_API_TIMEOUT
});

export default request;