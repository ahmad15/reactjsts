import Todo from "../models/todo.model";
import request from './request';

import CONST from '../constants';

const TodoApi = {
  getData: (token: string, query: string | null) =>
    request<Todo["detail"][]>({
      headers: {
        'Authorization': `Bearer ${token}`
      },
      method: 'GET',
      url: `/todos?${query}`
    }),
  getDetailData: (token: string, id: string) =>
    request<Todo>({
      headers: {
        'Authorization': `Bearer ${token}`
      },
      method:'GET',
      url:`/todo/${id}`
    }),
  postData: (token: string, todo: Todo["create"]) => {
    const formData = new FormData();
    formData.append('title', todo.title);
    formData.append('description', todo.description);
    formData.append('deadline', todo.deadline.toISOString());
    formData.append('status', CONST.STATUS.TODO);

    if (todo.snapshot) {
      formData.append('file', todo.snapshot);
    }

    return request({
      headers: {
        'content-type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      },
      method: 'POST',
      url:'/todo',
      data: formData
  })},
  patchData: (token: string, todo: Todo["update"]) => {
    const formData = new FormData();
    formData.append('title', todo.title);
    formData.append('description', todo.description);
    formData.append('deadline', new Date(todo.deadline).toISOString());
    formData.append('done', todo.done.toString());
    formData.append('status', todo.status);

    if (todo.snapshot) {
      formData.append('file', todo.snapshot);
    }

    return request({
      headers: {
        'content-type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      },
      method: 'PATCH',
      url:`/todo/${todo.id}`,
      data: formData
  })},
  deleteData: (token: string, id: string) =>
    request({
      headers: {
        'Authorization': `Bearer ${token}`
      },
      method:'DELETE',
      url:`/todo/${id}`
    }),
};

export default TodoApi;