interface Auth {
  email: string;
  password: string;
}

interface Detail {
  id: string;
  email: string;
  name: string;
  oldPassword?: string;
  password?: string;
  RetypePassword?: string;
  created?: Date;
  updated?: Date;
}

interface AuthResponse {
  tokenId: string;
}

export default interface User {
  auth: Auth;
  detail: Detail;
  authResponse: AuthResponse;
}