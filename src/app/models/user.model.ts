export interface User {
  id: string;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  tenant?: Tenant;
}

export interface Tenant {
  id: string;
  name: string;
  collection_name: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  tenant_name: string;
  collection_name?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
}