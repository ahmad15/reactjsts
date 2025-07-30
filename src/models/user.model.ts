interface Auth {
  email: string;
  password: string;
}

interface Detail {
  id: string;
  email: string;
  name: string;
}

interface AuthResponse {
  tokenId: string;
}

export default interface User {
  auth: Auth;
  detail: Detail;
  authResponse: AuthResponse;
}