export interface User {
  id: string;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  tenant?: Tenant | null;
}

export interface Tenant {
  id: string;
  name: string;
  collection_name?: string;
  slug?: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  tenant?: string;
  tenant_name?: string;
  collection_name?: string;
}

export interface LoginRequest {
  username?: string;
  email?: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface ProtectedResponse {
  user: User;
  token: string;
}

export interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
}