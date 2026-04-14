export interface DecodedToken {
  sub: number;
  email: string;
  roles: string[];
  iat: number;
  exp: number;
}

export interface User {
  id: number;
  email: string;
  role: 'admin' | 'doctor' | 'patient';
}
