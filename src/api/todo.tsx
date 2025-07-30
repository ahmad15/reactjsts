import axios from 'axios';

import Todo from "../models/todo.model";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URI,
  headers: {
      'content-type':'application/json'
  },
  withCredentials: true,
  timeout: process.env.REACT_APP_API_TIMEOUT
});

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getData: (token: string, query: string | null) =>
    instance<Todo["detail"][]>({
      headers: {
        'Authorization': `Bearer ${token}`
      },
      method: 'GET',
      url: `/todos?${query}`
    }),
  getDetailData: (token: string, id: string) =>
    instance<Todo>({
      headers: {
        'Authorization': `Bearer ${token}`
      },
      method:'GET',
      url:`/todos${id}`
    }),
  postData: (token: string, todo: Todo["create"]) =>
    instance({
      headers: {
        'Authorization': `Bearer ${token}`
      },
      method: 'POST',
      url:'/todo',
      data: {
        title: todo.title,
        description: todo.description,
        deadline: todo.deadline
      }
  }),
  patchData: (token: string, todo: Todo["detail"]) =>
    instance({
      headers: {
        'Authorization': `Bearer ${token}`
      },
      method: 'PATCH',
      url:`/todo/${todo.id}`,
      data: {
        title: todo.title,
        description: todo.description,
        deadline: todo.deadline,
        done: todo.done
      }
  }),
  deleteData: (token: string, id: string) =>
    instance({
      headers: {
        'Authorization': `Bearer ${token}`
      },
      method:'DELETE',
      url:`/todo/${id}`
    }),
};