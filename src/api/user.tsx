import axios from 'axios';

import User from "../models/user.model";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URI,
  headers: {
      'content-type':'application/json'
  },
  timeout: process.env.REACT_APP_API_TIMEOUT
});

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  auth: (input: User["auth"]) =>
    instance<User["authResponse"]>({
      'method':'POST',
      'url':`/auth`,
      'data': {
        email: input.email,
        password: input.password
      }
    })
};