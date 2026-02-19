// ===== CREDENTIALS =====

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

// ===== USER DATA =====

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
  membership_end: string | undefined;
}

// ===== API RESPONSES =====

export interface ProfileResponse {
  success: boolean;
  code: string;
  data: Profile;
}

/**
 * Login response
 * Format actuel du backend
 */
export interface LoginResponse {
  success?: boolean;
  firstname?: string;
  lastname?: string;
  avatar?: string;
  sessionToken?: string;
  refreshToken?: string;
}

export interface SignInResponse {
  success: boolean;
  message: string;
  token?: string;
}

export interface TokenValidationResponse {
  valid: boolean;
  nickname?: string;
  email?: string;
}

export interface GoogleAuthResponse {
  authUrl: string;
}
