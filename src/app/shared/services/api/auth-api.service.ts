import { Injectable } from '@angular/core';
import {
<<<<<<< HEAD
  LoginCredentials, LoginResponse, GoogleAuthResponse, User, SignInCredentials,
  SignInResponse, ConfirmSignupCredentials, TokenValidationResponse
} from '@models/auth.model';
=======
  LoginCredentials,
  LoginResponse,
  GoogleAuthResponse,
  User,
  SignInCredentials,
  SignInResponse,
  ConfirmSignupCredentials,
  TokenValidationResponse,
  ProfileResponse
} from '@models/auth.model';

/**
 * AUTH API - Pure HTTP Calls + Token Storage
 *
 * RÈGLES:
 * - Gère les appels HTTP
 * - Stocke/supprime les tokens dans localStorage
 * - NE met JAMAIS à jour le store
 * - Retourne les données brutes de l'API
 * - Appelé UNIQUEMENT par le facade service
 */
>>>>>>> deploy

@Injectable({
  providedIn: 'root'
})
export class AuthApi {
  private baseUrl = 'http://localhost:5002';

  /**
   * Crée les headers avec le token Bearer depuis localStorage
   */
  private createAuthHeaders(): Headers {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const token = localStorage.getItem('session_token');
    if (token) {
      headers.append('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  /**
   * Login with credentials
   * Stocke automatiquement les tokens dans localStorage
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const response = await fetch(`${this.baseUrl}/user/v1/public/login`, {
      method: 'POST',
      headers,
      body: JSON.stringify(credentials)
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
<<<<<<< HEAD
    console.log('Login response data:', data);
    return data
=======

    // Stocke les tokens dans localStorage
    if (data.sessionToken) localStorage.setItem('session_token', data.sessionToken);
    if (data.refreshToken) localStorage.setItem('refresh_token', data.refreshToken);

    return data;
>>>>>>> deploy
  }

  /**
   * Sign in with nickname and email
   */
  async signIn(credentials: SignInCredentials): Promise<SignInResponse> {
    const headers = new Headers({ 'Content-Type': 'application/json' });

    const response = await fetch(`${this.baseUrl}/user/v1/public/signin`, {
      method: 'POST',
      headers,
<<<<<<< HEAD
      credentials: 'include',
=======
>>>>>>> deploy
      body: JSON.stringify(credentials)
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

<<<<<<< HEAD









  /**
     * Validate signup token
     * @param token Token from URL
     * @returns TokenValidationResponse
     */
  public async validateSignupToken(token: string): Promise<TokenValidationResponse> {
    const headers = new Headers({ 'Content-Type': 'application/json' });

    const response = await fetch(`${this.baseUrl}/user/v1/public/validate-signup-token`, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify({ token })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `${response.status}: ${response.statusText}`);
    }

    return response.json();
  }








  /**
     * Confirm signup with token and password
     * @param credentials ConfirmSignupCredentials (token, password)
     * @returns SignInResponse
     */
  public async confirmSignup(credentials: ConfirmSignupCredentials): Promise<SignInResponse> {
    const headers = new Headers({ 'Content-Type': 'application/json' });

    const response = await fetch(`${this.baseUrl}/user/v1/public/confirm-signup`, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify(credentials)
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `${response.status}: ${response.statusText}`);
    }

    return response.json();
  }








  /**
   * Logout the user
   */
  public async logout(): Promise<void> {
    const headers = new Headers({ 'Content-Type': 'application/json' });

    const sessionToken = localStorage.getItem('session_token');
    if (sessionToken) headers.append('Authorization', `Bearer ${sessionToken}`);

    const response = await fetch(`${this.baseUrl}/user/v1/public/logout`, { method: 'POST', headers, credentials: 'include' });
    const data = await response.json();
    console.log('Logout response data:', data);

    if (!response.ok) throw new Error(`Erreur de déconnexion: ${response.status}`);
  }






  public async checkSession(): Promise<User> {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    const sessionToken = localStorage.getItem('session_token');
    if (sessionToken) headers.append('Authorization', `Bearer ${sessionToken}`);

    const response = await fetch(`${this.baseUrl}/user/v1/public/verify`, { headers, credentials: 'include' });

    if (!response.ok) throw new Error(`Profil inaccessible: ${response.status}`);

    const data = await response.json();
    console.log('Profile data:', data);
    return data.user;
  }





  /**
   * Check Google authentication URL
   * @returns GoogleAuthResponse
   */
  public async getGoogleAuthUrl(): Promise<GoogleAuthResponse> {
    const headers = new Headers({ 'Content-Type': 'application/json' });

    const sessionToken = localStorage.getItem('session_token');
    if (sessionToken) headers.append('Authorization', `Bearer ${sessionToken}`);

    const response = await fetch(`${this.baseUrl}/auth/google`, { headers, credentials: 'include' });

    if (!response.ok) throw new Error(`Impossible d'obtenir l'URL Google: ${response.status}`);

    return response.json();
  }





  /**
   * Forgot password
   * @param email
   * @returns
   */
  public async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    const sessionToken = localStorage.getItem('session_token');
    if (sessionToken) headers.append('Authorization', `Bearer ${sessionToken}`);

    const response = await fetch(`${this.baseUrl}/user/v1/public/forgot-password`, { method: 'POST', headers, credentials: 'include', body: JSON.stringify({ email }) });

    if (!response.ok) throw new Error(`Échec de réinitialisation: ${response.status}`);

    return response.json();
  }





  /**
   * Validate reset token
   * @param token Token from URL
   * @returns TokenValidationResponse
   */
  public async validateResetToken(token: string): Promise<TokenValidationResponse> {
    const headers = new Headers({ 'Content-Type': 'application/json' });

    const response = await fetch(`${this.baseUrl}/user/v1/public/validate-reset-token`, {
=======
  /**
   * Validate signup token
   */
  async validateSignupToken(token: string): Promise<TokenValidationResponse> {
    const headers = new Headers({ 'Content-Type': 'application/json' });

    const response = await fetch(`${this.baseUrl}/user/v1/public/validate-signup-token`, {
>>>>>>> deploy
      method: 'POST',
      headers,
      body: JSON.stringify({ token })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Confirm signup with token and password
   * Stocke automatiquement le token si présent (connexion auto après signup)
   */
  async confirmSignup(credentials: ConfirmSignupCredentials): Promise<SignInResponse> {
    const headers = new Headers({ 'Content-Type': 'application/json' });

    const response = await fetch(`${this.baseUrl}/user/v1/public/confirm-signup`, {
      method: 'POST',
      headers,
<<<<<<< HEAD
      credentials: 'include',
      body: JSON.stringify({
        token: credentials.token,
        password: credentials.password
      })
=======
      body: JSON.stringify(credentials)
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // Stocke le token si présent (connexion automatique après signup)
    if (data.token) {
      localStorage.setItem('session_token', data.token);
    }

    return data;
  }

  /**
   * Logout the user
   * Supprime les tokens du localStorage
   */
  async logout(): Promise<void> {
    const response = await fetch(`${this.baseUrl}/user/v1/public/logout`, {
      method: 'POST',
      headers: this.createAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Erreur de déconnexion: ${response.status}`);
    }

    // Supprime les tokens du localStorage
    localStorage.removeItem('session_token');
    localStorage.removeItem('refresh_token');
  }

  /**
   * Check if session is valid and get user data
   */
  async checkSession(): Promise<User> {
    const response = await fetch(`${this.baseUrl}/user/v1/public/verify`, {
      headers: this.createAuthHeaders()
    });

    if (!response.ok) throw new Error(`Session invalide: ${response.status}`);

    const data = await response.json();
    console.log('\x1b[34m [API] - checkSession() - data :\x1b[0m', data);

    // Construire l'objet User depuis la réponse
    return {
      user: {
        firstname: data.firstname,
        lastname: data.lastname,
        avatar: data.avatar
      }
    };
  }

  /**
   * Get user profile with all information
   */
  async getProfile(): Promise<ProfileResponse> {
    const response = await fetch(`${this.baseUrl}/user/v1/public/profile`, {
      headers: this.createAuthHeaders()
    });

    if (!response.ok)  throw new Error(`Profil inaccessible: ${response.status}`);

    return response.json();
  }

  /**
   * Get Google OAuth2 authentication URL
   */
  async getGoogleAuthUrl(): Promise<GoogleAuthResponse> {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const response = await fetch(`${this.baseUrl}/user/v1/auth/google`, { headers });

    if (!response.ok) {
      throw new Error(`Impossible d'obtenir l'URL Google: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Forgot password
   */
  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const response = await fetch(`${this.baseUrl}/user/v1/public/forgot-password`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ email })
    });

    if (!response.ok) {
      throw new Error(`Échec de réinitialisation: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Validate reset token
   */
  async validateResetToken(token: string): Promise<TokenValidationResponse> {
    const headers = new Headers({ 'Content-Type': 'application/json' });

    const response = await fetch(`${this.baseUrl}/user/v1/public/validate-reset-token`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ token })
>>>>>>> deploy
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

<<<<<<< HEAD





  /**
   * Get user profile with all information (VERSION JWT)
   * @returns Profile
   */
  public async getProfile(): Promise<ProfileResponse> {
    const response = await fetch(`${this.baseUrl}/user/v1/public/profile`, {
      headers: this.createAuthHeaders()
    });

    if (!response.ok) throw new Error(`Profil inaccessible: ${response.status}`);

    const data: ProfileResponse = await response.json();
    console.log(chalk.blue('[API] - getProfile() - data:', data));
    return data;
  }


}
=======
  /**
   * Reset password with token
   */
  async resetPassword(credentials: { token: string; password: string }): Promise<{ success: boolean; message: string }> {
    const headers = new Headers({ 'Content-Type': 'application/json' });

    const response = await fetch(`${this.baseUrl}/user/v1/public/reset-password`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        token: credentials.token,
        password: credentials.password
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Clear tokens from localStorage
   * Appelé par le facade en cas d'erreur ou de logout
   */
  clearTokens(): void {
    localStorage.removeItem('session_token');
    localStorage.removeItem('refresh_token');
  }
}
>>>>>>> deploy
