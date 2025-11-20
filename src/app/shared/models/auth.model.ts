export interface LoginCredentials {
  nickname: string;
  password: string;
}

export interface SignInCredentials {
  nickname: string;
  email: string;
}

export interface ConfirmSignupCredentials {
  token: string;
  password: string;
}

export interface User {
  firstname: string;
  lastname: string;
  avatar?: string;
}

export interface Profile {
  nickname: string;
  email: string;
  firstname: string;
  lastname: string;
  registration_date: string;
  last_login: string;
  avatar?: string;
  role_name: string;
  role_color: string;
  membership_label: string;
}

export interface ProfileResponse {
  success: boolean;
  code: string;
  data: Profile;
}

export interface LoginResponse {
  firstname: string;
  lastname: string;
  avatar?: string;
  sessionToken: string;
  refreshToken: string;
}

export interface SignInResponse {
  success: boolean;
  message: string;
}

export interface TokenValidationResponse {
  valid: boolean;
  nickname?: string;
  email?: string;
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