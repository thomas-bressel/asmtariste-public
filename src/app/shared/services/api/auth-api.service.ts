import { Injectable } from '@angular/core';
import {
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

import { USER_API_URI } from '../../config-api';

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

@Injectable({
  providedIn: 'root'
})
export class AuthApi {
  private baseUrl = USER_API_URI;

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

    // Stocke les tokens dans localStorage
    if (data.sessionToken) localStorage.setItem('session_token', data.sessionToken);
    if (data.refreshToken) localStorage.setItem('refresh_token', data.refreshToken);

    return data;
  }

  /**
   * Sign in with nickname and email
   */
  async signIn(credentials: SignInCredentials): Promise<SignInResponse> {
    const headers = new Headers({ 'Content-Type': 'application/json' });

    const response = await fetch(`${this.baseUrl}/user/v1/public/signin`, {
      method: 'POST',
      headers,
      body: JSON.stringify(credentials)
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Validate signup token
   */
  async validateSignupToken(token: string): Promise<TokenValidationResponse> {
    const headers = new Headers({ 'Content-Type': 'application/json' });

    const response = await fetch(`${this.baseUrl}/user/v1/public/validate-signup-token`, {
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
    // console.log('\x1b[34m [API] - checkSession() - data :\x1b[0m', data);

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
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

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
