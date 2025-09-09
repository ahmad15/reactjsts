interface Detail {
  id: string;
  email: string;
  name: string;
  exp: number;
  iat: number;
}

export default interface Token {
  credential: Detail;
}