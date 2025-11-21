import { Injectable } from '@angular/core';
import { LoginCredentials, LoginResponse, GoogleAuthResponse, User, SignInCredentials,
          SignInResponse,  ConfirmSignupCredentials, TokenValidationResponse, ProfileResponse } from '@models/auth.model';
import chalk from "chalk";

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
   * Login with credentials (VERSION JWT)
   * Le token JWT est reçu dans la réponse JSON et stocké dans localStorage
   * @param credentials
   * @returns LoginResponse (contient les données user + le token)
   */
  public async login(credentials: LoginCredentials): Promise<LoginResponse> {
    console.log('\x1b[34m[API] - login() - called :\xb1[0m');
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
    console.log('\x1b[34m[API] - login() - data :\xb1[0m', data);

    // Stocke les tokens dans localStorage
    // Support des deux formats : nouveau (token) ou ancien (sessionToken + refreshToken)
    const sessionToken = data.token || data.sessionToken;
    const refreshToken = data.refreshToken;

    if (sessionToken) localStorage.setItem('session_token', sessionToken);
    if (refreshToken) localStorage.setItem('refresh_token', refreshToken);

    return data;
  }







  /**
   * Sign in with nickname and email
   * @param credentials SignInCredentials (nickname, email)
   * @returns SignInResponse
   */
  public async signIn(credentials: SignInCredentials): Promise<SignInResponse> {
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
   * @param token Token from URL
   * @returns TokenValidationResponse
   */
  public async validateSignupToken(token: string): Promise<TokenValidationResponse> {
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
   * @param credentials ConfirmSignupCredentials (token, password)
   * @returns SignInResponse
   */
  public async confirmSignup(credentials: ConfirmSignupCredentials): Promise<SignInResponse> {
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
      localStorage.setItem('token', data.token);
    }

    return data;
  }




  



  /**
   * Logout the user (VERSION JWT)
   * Supprime les tokens du localStorage
   */
  public async logout(): Promise<void> {
    const response = await fetch(`${this.baseUrl}/user/v1/public/logout`, {
      method: 'POST',
      headers: this.createAuthHeaders()
    });

    if (!response.ok) throw new Error(`Erreur de déconnexion: ${response.status}`);

    // Supprime les tokens du localStorage
    localStorage.removeItem('session_token');
    localStorage.removeItem('refresh_token');

    const data = await response.json();
    console.log('Logout response data:', data);
  }









  /**
   * Check if session is valid (VERSION JWT)
   */
  public async checkSession(): Promise<User> {
    const response = await fetch(`${this.baseUrl}/user/v1/public/verify`, {
      headers: this.createAuthHeaders()
    });
    if (!response.ok) throw new Error(`Profil inaccessible: ${response.status}`);
    const data = await response.json();
    console.log('\x1b[34m[API] checkSession() - data:\x1b[0m', data);
    return data;
  }







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





  /**
   * Get Google OAuth2 authentication URL
   * @returns GoogleAuthResponse with authUrl
   */
  public async getGoogleAuthUrl(): Promise<GoogleAuthResponse> {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const response = await fetch(`${this.baseUrl}/user/v1/auth/google`, { headers });
    if (!response.ok) throw new Error(`Impossible d'obtenir l'URL Google: ${response.status}`);
    return response.json();
  }





/**
 * Forgot password
 * @param email
 * @returns
 */
  public async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const response = await fetch(`${this.baseUrl}/user/v1/public/forgot-password`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ email })
    });

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
   * @param credentials ResetPasswordCredentials (token, password)
   * @returns Success response
   */
  public async resetPassword(credentials: { token: string; password: string }): Promise<{ success: boolean; message: string }> {
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
}