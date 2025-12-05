import { Injectable, Signal, inject } from '@angular/core';
import { AuthStore } from '@services/store/auth-store.service';
import { AuthApi } from '@services/api/auth-api.service';
import { LoginCredentials, SignInCredentials, ConfirmSignupCredentials, User, ProfileResponse } from '@models/auth.model';
import chalk from 'chalk';

/**
 * AUTH FACADE SERVICE - Orchestration Layer
 *
 * RULES:
 * - Single entry point for components
 * - Calls the API (which manages localStorage), then updates the store based on the response
 * - Components should NEVER call API or Store directly
 */

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authApi = inject(AuthApi);
  private authStore = inject(AuthStore);

  // ===== EXPOSED SELECTORS =====

  /**
   * Gets the current authenticated user signal
   * @returns Signal containing the current user data or null if not authenticated
   */
  get user(): Signal<User | null> {
    return this.authStore.user;
  }

  /**
   * Gets the loading state signal for authentication operations
   * @returns Signal indicating if an authentication operation is in progress
   */
  get isLoading(): Signal<boolean> {
    return this.authStore.isLoading;
  }

  /**
   * Gets the authentication error signal
   * @returns Signal containing the last authentication error message or null
   */
  get error(): Signal<string | null> {
    return this.authStore.error;
  }

  /**
   * Gets the authentication status signal
   * @returns Signal indicating if a user is currently authenticated
   */
  get isAuthenticated(): Signal<boolean> {
    return this.authStore.isAuthenticated;
  }

  /**
   * Gets the current session token signal
   * @returns Signal containing the session token or null if not authenticated
   */
  get sessionToken(): Signal<string | null> {
    return this.authStore.sessionToken;
  }

  /**
   * Gets the current refresh token signal
   * @returns Signal containing the refresh token or null if not available
   */
  get refreshToken(): Signal<string | null> {
    return this.authStore.refreshToken;
  }

  /**
   * Gets the user profile data signal
   * @returns Signal containing the user profile data or null if not loaded
   */
  get profile(): Signal<ProfileResponse | null> {
    return this.authStore.profile;
  }

  /**
   * Gets the profile loading state signal
   * @returns Signal indicating if profile data is being loaded
   */
  get profileLoading(): Signal<boolean> {
    return this.authStore.profileLoading;
  }

  /**
   * Gets the profile error signal
   * @returns Signal containing the profile loading error message or null
   */
  get profileError(): Signal<string | null> {
    return this.authStore.profileError;
  }

  // ===== INITIALIZATION =====

  /**
   * Initializes authentication state from JWT token in localStorage
   * Called by APP_INITIALIZER to restore session on app startup
   * @returns Promise that resolves when initialization is complete
   */
  async initialize(): Promise<void> {
    const token = localStorage.getItem('session_token');

    if (token) {
      try {
        this.authStore.setLoading(true);

        // Verify if the token is valid and retrieve user data
        const userData = await this.authApi.checkSession();

        this.authStore.setAuthData(userData, token);
      } catch (error) {
        console.error('Invalid token during initialization:', error);
        this.authApi.clearTokens();
        this.authStore.clearAuth();
      }
    }
  }

  // ===== AUTH OPERATIONS =====

  /**
   * Authenticates a user with email and password credentials
   * Stores tokens in localStorage and updates the auth store on success
   * @param credentials - User login credentials (email and password)
   * @returns Promise that resolves when login is complete
   * @throws Error if login fails or response format is invalid
   */
  async login(credentials: LoginCredentials): Promise<void> {
    // console.log(chalk.green('[FACADE] - login() called'));

    this.authStore.clearError();
    this.authStore.setLoading(true);

    try {
      // 1. API call (automatically stores tokens in localStorage)
      const response = await this.authApi.login(credentials);
      // console.log(chalk.green('[FACADE] - login() response:', JSON.stringify(response, null, 2)));

      // 2. Verify that the response contains necessary data
      if (!response.sessionToken) {
        throw new Error('Invalid response format: sessionToken missing');
      }

      // 3. Build User object
      const user: User = {
        user: {
          firstname: response.firstname!,
          lastname: response.lastname!,
          avatar: response.avatar
        }
      };

      // 4. Update store
      this.authStore.setAuthData(user, response.sessionToken, response.refreshToken || null);

      // console.log(chalk.green('[FACADE] - login() success - User:', user));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      this.authStore.setError(errorMessage);
      throw error;
    }
  }

  /**
   * Registers a new user with nickname and email
   * Sends a confirmation email to complete the registration
   * @param credentials - User registration credentials (nickname, email)
   * @returns Promise that resolves when registration request is complete
   * @throws Error if registration fails
   */
  async signIn(credentials: SignInCredentials): Promise<void> {
    this.authStore.clearError();
    this.authStore.setLoading(true);

    try {
      await this.authApi.signIn(credentials);
      this.authStore.setLoading(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      this.authStore.setError(errorMessage);
      throw error;
    }
  }

  /**
   * Confirms user signup with token and password
   * Completes the registration process after email confirmation
   * @param credentials - Confirmation credentials (token and password)
   * @returns Promise that resolves when confirmation is complete
   * @throws Error if confirmation fails
   */
  async confirmSignup(credentials: ConfirmSignupCredentials): Promise<void> {
    this.authStore.clearError();
    this.authStore.setLoading(true);

    try {
      await this.authApi.confirmSignup(credentials);
      this.authStore.setLoading(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Confirmation failed';
      this.authStore.setError(errorMessage);
      throw error;
    }
  }

  /**
   * Initiates Google OAuth authentication flow
   * Returns the Google authentication URL to redirect the user
   * @returns Promise resolving to the Google OAuth authorization URL
   * @throws Error if unable to get Google auth URL
   */
  async loginWithGoogle(): Promise<string> {
    this.authStore.clearError();
    this.authStore.setLoading(true);

    try {
      const response = await this.authApi.getGoogleAuthUrl();
      this.authStore.setLoading(false);
      return response.authUrl;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Google login failed';
      this.authStore.setError(errorMessage);
      throw error;
    }
  }

  /**
   * Logs out the current user
   * Clears tokens from localStorage and resets authentication state
   * @returns Promise that resolves when logout is complete
   */
  async logout(): Promise<void> {
    this.authStore.clearError();
    this.authStore.setLoading(true);

    try {
      // API removes tokens from localStorage
      await this.authApi.logout();
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      this.authStore.clearAuth();
      this.authStore.clearProfile();
    }
  }

  /**
   * Initiates password reset process
   * Sends a password reset email to the specified address
   * @param email - Email address to send password reset link
   * @returns Promise that resolves when reset email is sent
   * @throws Error if request fails
   */
  async forgotPassword(email: string): Promise<void> {
    this.authStore.clearError();
    this.authStore.setLoading(true);

    try {
      await this.authApi.forgotPassword(email);
      this.authStore.setLoading(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Password reset request failed';
      this.authStore.setError(errorMessage);
      throw error;
    }
  }

  /**
   * Resets user password using a reset token
   * Completes the password reset process after email link click
   * @param credentials - Reset credentials containing token and new password
   * @returns Promise that resolves when password is reset
   * @throws Error if reset fails
   */
  async resetPassword(credentials: { token: string; password: string }): Promise<void> {
    this.authStore.clearError();
    this.authStore.setLoading(true);

    try {
      await this.authApi.resetPassword(credentials);
      this.authStore.setLoading(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Password reset failed';
      this.authStore.setError(errorMessage);
      throw error;
    }
  }

  /**
   * Fetches the authenticated user's profile data
   * Updates the profile store with the retrieved data
   * @returns Promise resolving to the user's profile data
   * @throws Error if profile loading fails
   */
  async getProfile(): Promise<ProfileResponse> {
    this.authStore.setProfileLoading(true);

    try {
      // 1. API call
      const profileData = await this.authApi.getProfile();

      // 2. Update store
      this.authStore.setProfile(profileData);

      return profileData;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unable to load profile';
      this.authStore.setProfileError(errorMessage);
      throw error;
    }
  }

  /**
   * Clears any authentication error from the store
   */
  clearError(): void {
    this.authStore.clearError();
  }
}
