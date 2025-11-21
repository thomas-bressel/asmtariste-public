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
  user: {
    firstname: string;
    lastname: string;
    avatar?: string;
  }
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
  membership_start: string;
  membership_end: string;
}

export interface ProfileResponse {
  success: boolean;
  code: string;
  data: Profile;
}

// ✅ VERSION JWT: Un seul token pour tout (User API + Content API)
// Support des deux formats
export interface LoginResponse {
  success?: boolean;
  data?: {
    firstname: string;
    lastname: string;
    avatar?: string;
  };
  token?: string;  // Nouveau format
  // Ancien format (compatibilité)
  firstname?: string;
  lastname?: string;
  avatar?: string;
  sessionToken?: string;
  refreshToken?: string;
}

export interface SignInResponse {
  success: boolean;
  message: string;
  token?: string;  // JWT optionnel si signup direct
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