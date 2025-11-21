import { Injectable } from '@angular/core';
import {
  LoginCredentials, LoginResponse, GoogleAuthResponse, User, SignInCredentials,
  SignInResponse, ConfirmSignupCredentials, TokenValidationResponse
} from '@models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthApi {
  private baseUrl = 'http://localhost:5002';



  /**
   * Login with credentials
   * @param credentials
   * @returns LoginResponse
   */
  public async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const headers = new Headers({ 'Content-Type': 'application/json' });

    const sessionToken = localStorage.getItem('session_token');
    if (sessionToken) headers.append('Authorization', `Bearer ${sessionToken}`);

    const response = await fetch(`${this.baseUrl}/user/v1/public/login`, { method: 'POST', headers, credentials: 'include', body: JSON.stringify(credentials) });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    console.log('Login response data:', data);
    return data
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
   * Reset password with token
   * @param credentials ResetPasswordCredentials (token, password)
   * @returns Success response
   */
  public async resetPassword(credentials: { token: string; password: string }): Promise<{ success: boolean; message: string }> {
    const headers = new Headers({ 'Content-Type': 'application/json' });

    const response = await fetch(`${this.baseUrl}/user/v1/public/reset-password`, {
      method: 'POST',
      headers,
      credentials: 'include',
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