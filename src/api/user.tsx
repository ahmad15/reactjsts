import request from './request';

import User from "../models/user.model";
/**
 * User API
 * This module handles user-related API requests.
 */
const UserApi = {
  auth: (input: User["auth"]) =>
    request<User["authResponse"]>({
      'method':'POST',
      'url':`/auth`,
      'data': {
        email: input.email,
        password: input.password
      }
    }),
  getDetailData: (token: string, id: string) =>
    request<User['detail']>({
      headers: {
        'Authorization': `Bearer ${token}`
      },
      method:'GET',
      url:`/user/${id}`
    }),
  patchProfileData: (token: string, user: User["detail"]) => {
    const formData = new FormData();
    formData.append('email', user.email);
    formData.append('name', user.name);

    user.password && formData.append('password', user.password);
    user.oldPassword && formData.append('oldPassword', user.oldPassword);

    return request({
      headers: {
        'Authorization': `Bearer ${token}`
      },
      method: 'PATCH',
      url:`/user/profile/${user.id}`,
      data: formData
  })}
};

export default UserApi;