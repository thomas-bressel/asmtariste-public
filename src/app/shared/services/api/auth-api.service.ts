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

import { USER_API_URI, PROJECT_ID } from '../../config-api';

/**
 * Authentication API Service - Pure HTTP Operations + Token Storage
 *
 * This service handles all HTTP calls related to authentication and manages
 * session tokens in localStorage. It provides methods for login, signup,
 * password reset, and session validation.
 *
 * RULES:
 * - Handles HTTP calls to the authentication API
 * - Stores/removes tokens in localStorage
 * - NEVER updates the application store directly
 * - Returns raw data from the API
 * - Should ONLY be called by the facade service
 */

@Injectable({
  providedIn: 'root'
})
export class AuthApi {
  private baseUrl = USER_API_URI;

  /**
   * Creates HTTP headers with Bearer token from localStorage
   * @private
   * @returns {Headers} Headers object with Content-Type and Authorization (if token exists)
   */
  private createAuthHeaders(): Headers {
    const headers = new Headers({ 
      'Content-Type': 'application/json',
      'X-Project-ID': PROJECT_ID 
    });
    const token = localStorage.getItem('session_token');
    if (token) {
      headers.append('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  /**
   * Authenticates a user with email and password credentials
   * Automatically stores session and refresh tokens in localStorage upon successful login
   * @param {LoginCredentials} credentials - User login credentials (email and password)
   * @returns {Promise<LoginResponse>} Promise resolving to login response with tokens and user data
   * @throws {Error} Throws error if authentication fails or API returns non-OK response
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const headers = new Headers({ 
      'Content-Type': 'application/json',
      'X-Project-ID': PROJECT_ID 
    });
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

    // Store tokens in localStorage
    if (data.sessionToken) localStorage.setItem('session_token', data.sessionToken);
    if (data.refreshToken) localStorage.setItem('refresh_token', data.refreshToken);

    return data;
  }

  /**
   * Registers a new user account with nickname and email
   * Sends a confirmation email to complete the signup process
   * @param {SignInCredentials} credentials - User registration credentials (nickname and email)
   * @returns {Promise<SignInResponse>} Promise resolving to registration response
   * @throws {Error} Throws error if registration fails or API returns non-OK response
   */
  async signIn(credentials: SignInCredentials): Promise<SignInResponse> {
    const headers = new Headers({ 
      'Content-Type': 'application/json',
      'X-Project-ID': PROJECT_ID 
    });

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
   * Validates a signup confirmation token received via email
   * Verifies that the token is valid and not expired
   * @param {string} token - The signup confirmation token to validate
   * @returns {Promise<TokenValidationResponse>} Promise resolving to validation response
   * @throws {Error} Throws error if token is invalid, expired, or API returns non-OK response
   */
  async validateSignupToken(token: string): Promise<TokenValidationResponse> {
    const headers = new Headers({ 
      'Content-Type': 'application/json',
      'X-Project-ID': PROJECT_ID 
    });

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
   * Completes the signup process by confirming the token and setting a password
   * Automatically stores the session token in localStorage for auto-login after signup
   * @param {ConfirmSignupCredentials} credentials - Confirmation credentials (token and password)
   * @returns {Promise<SignInResponse>} Promise resolving to signup confirmation response
   * @throws {Error} Throws error if confirmation fails or API returns non-OK response
   */
  async confirmSignup(credentials: ConfirmSignupCredentials): Promise<SignInResponse> {
    const headers = new Headers({ 
      'Content-Type': 'application/json',
      'X-Project-ID': PROJECT_ID 
    });

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

    // Store token if present (automatic login after signup)
    if (data.token) {
      localStorage.setItem('session_token', data.token);
    }

    return data;
  }

  /**
   * Logs out the current user
   * Removes session and refresh tokens from localStorage
   * Makes HTTP POST request to logout endpoint
   * @returns {Promise<void>} Promise resolving when logout is complete
   * @throws {Error} Throws error if logout request fails
   */
  async logout(): Promise<void> {
    const response = await fetch(`${this.baseUrl}/user/v1/public/logout`, {

      method: 'POST',
      headers: this.createAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Logout error: ${response.status}`);
    }

    // Remove tokens from localStorage
    localStorage.removeItem('session_token');
    localStorage.removeItem('refresh_token');
  }

  /**
   * Verifies the validity of the current session and retrieves user data
   * Makes HTTP GET request to verify endpoint with Bearer token from localStorage
   * @returns {Promise<User>} Promise resolving to user object with profile information
   * @throws {Error} Throws error if session is invalid or expired
   */
  async checkSession(): Promise<User> {
    const response = await fetch(`${this.baseUrl}/user/v1/public/verify`, {
      headers: this.createAuthHeaders()
    });

    if (!response.ok) throw new Error(`Invalid session: ${response.status}`);

    const data = await response.json();
    // console.log('\x1b[34m [API] - checkSession() - data :\x1b[0m', data);

    // Build User object from response
    return {
      user: {
        firstname: data.firstname,
        lastname: data.lastname,
        avatar: data.avatar
      }
    };
  }

  /**
   * Retrieves the complete user profile with all information
   * Makes HTTP GET request to profile endpoint with Bearer token
   * @returns {Promise<ProfileResponse>} Promise resolving to complete profile data
   * @throws {Error} Throws error if profile is inaccessible or user is not authenticated
   */
  async getProfile(): Promise<ProfileResponse> {
    const response = await fetch(`${this.baseUrl}/user/v1/public/profile`, {
      headers: this.createAuthHeaders()
    });

    if (!response.ok)  throw new Error(`Profile inaccessible: ${response.status}`);

    return response.json();
  }

  /**
   * Retrieves the Google OAuth2 authentication URL for social login
   * Makes HTTP GET request to Google auth endpoint
   * @returns {Promise<GoogleAuthResponse>} Promise resolving to Google OAuth URL
   * @throws {Error} Throws error if unable to retrieve Google auth URL
   */
  async getGoogleAuthUrl(): Promise<GoogleAuthResponse> {
    const headers = new Headers({ 
      'Content-Type': 'application/json',
      'X-Project-ID': PROJECT_ID 
    });
    const response = await fetch(`${this.baseUrl}/user/v1/auth/google`, { headers });

    if (!response.ok) {
      throw new Error(`Unable to retrieve Google URL: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Initiates the password reset process by sending a reset email
   * Makes HTTP POST request to forgot-password endpoint
   * @param {string} email - Email address of the user requesting password reset
   * @returns {Promise<{success: boolean, message: string}>} Promise resolving to success status and message
   * @throws {Error} Throws error if password reset request fails
   */
  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    const headers = new Headers({ 
      'Content-Type': 'application/json',
      'X-Project-ID': PROJECT_ID 
    });
    const response = await fetch(`${this.baseUrl}/user/v1/public/forgot-password`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ email })
    });

    if (!response.ok) {
      throw new Error(`Reset failed: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Validates a password reset token received via email
   * Verifies that the token is valid and not expired
   * @param {string} token - The password reset token to validate
   * @returns {Promise<TokenValidationResponse>} Promise resolving to validation response
   * @throws {Error} Throws error if token is invalid, expired, or API returns non-OK response
   */
  async validateResetToken(token: string): Promise<TokenValidationResponse> {
    const headers = new Headers({ 
      'Content-Type': 'application/json',
      'X-Project-ID': PROJECT_ID 
    });

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
   * Resets the user's password using a valid reset token
   * Makes HTTP POST request with token and new password
   * @param {Object} credentials - Reset credentials object
   * @param {string} credentials.token - Valid password reset token
   * @param {string} credentials.password - New password to set
   * @returns {Promise<{success: boolean, message: string}>} Promise resolving to success status and message
   * @throws {Error} Throws error if password reset fails or token is invalid
   */
  async resetPassword(credentials: { token: string; password: string }): Promise<{ success: boolean; message: string }> {
    const headers = new Headers({ 
      'Content-Type': 'application/json',
      'X-Project-ID': PROJECT_ID 
    });

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
   * Clears authentication tokens from localStorage
   * Called by the facade service in case of error or logout
   * Does not make any HTTP requests, only removes local data
   */
  clearTokens(): void {
    localStorage.removeItem('session_token');
    localStorage.removeItem('refresh_token');
  }
}
