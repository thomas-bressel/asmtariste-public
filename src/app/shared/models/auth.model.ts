export interface LoginCredentials {
  nickname: string;
  password: string;
}

export interface User {
  firstname: string;
  lastname: string;
  avatar?: string;
}

export interface LoginResponse {
  firstname: string;
  lastname: string;
  avatar?: string;
  sessionToken: string;
  refreshToken: string;
}

export interface GoogleAuthResponse {
  authUrl: string;
}

export interface AuthState {
  user: User | null;
  sessionToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
}