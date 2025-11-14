import { Injectable } from '@angular/core';
import { LoginCredentials, LoginResponse, GoogleAuthResponse, User } from '@models/auth.model';

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

    const response = await fetch(`${this.baseUrl}/user/v1/admin/login`, { method: 'POST', headers, credentials: 'include', body: JSON.stringify(credentials) });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    console.log('Login response data:', data);
    return data 
  }





  /**
   * Logout the user
   */
  public async logout(): Promise<void> {
    const headers = new Headers({ 'Content-Type': 'application/json' });

    const sessionToken = localStorage.getItem('session_token');
    if (sessionToken) headers.append('Authorization', `Bearer ${sessionToken}`);

    const response = await fetch(`${this.baseUrl}/user/v1/admin/logout`, { method: 'POST', headers, credentials: 'include' });
    const data = await response.json();
    console.log('Logout response data:', data);

    if (!response.ok) throw new Error(`Erreur de déconnexion: ${response.status}`);
  }






  public async checkSession(): Promise<User> {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    const sessionToken = localStorage.getItem('session_token');
    if (sessionToken)  headers.append('Authorization', `Bearer ${sessionToken}`);

    const response = await fetch(`${this.baseUrl}/user/v1/admin/verify`, { headers, credentials: 'include'});

    if (!response.ok)  throw new Error(`Profil inaccessible: ${response.status}`);

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

    const response = await fetch(`${this.baseUrl}/auth/forgot-password`, { method: 'POST', headers, credentials: 'include', body: JSON.stringify({ email }) });

    if (!response.ok)  throw new Error(`Échec de réinitialisation: ${response.status}`);

    return response.json();
  }
}