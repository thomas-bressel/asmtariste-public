import { Injectable, Signal, inject } from '@angular/core';
import { AuthStore } from '@services/store/auth-store.service';
import { AuthApi } from '@services/api/auth-api.service';
import { LoginCredentials, SignInCredentials, ConfirmSignupCredentials, User, ProfileResponse } from '@models/auth.model';
import chalk from 'chalk';

/**
 * AUTH FACADE SERVICE - Orchestration Layer
 *
 * RÈGLES:
 * - Point d'entrée UNIQUE pour les composants
 * - Appelle l'API (qui gère localStorage), puis met à jour le store selon la réponse
 * - Les composants ne doivent JAMAIS appeler directement API ou Store
 */

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authApi = inject(AuthApi);
  private authStore = inject(AuthStore);

  // ===== EXPOSED SELECTORS =====
  get user(): Signal<User | null> {
    return this.authStore.user;
  }

  get isLoading(): Signal<boolean> {
    return this.authStore.isLoading;
  }

  get error(): Signal<string | null> {
    return this.authStore.error;
  }

  get isAuthenticated(): Signal<boolean> {
    return this.authStore.isAuthenticated;
  }

  get sessionToken(): Signal<string | null> {
    return this.authStore.sessionToken;
  }

  get refreshToken(): Signal<string | null> {
    return this.authStore.refreshToken;
  }

  get profile(): Signal<ProfileResponse | null> {
    return this.authStore.profile;
  }

  get profileLoading(): Signal<boolean> {
    return this.authStore.profileLoading;
  }

  get profileError(): Signal<string | null> {
    return this.authStore.profileError;
  }

  // ===== INITIALIZATION =====

  /**
   * Initialize authentication state from JWT token in localStorage
   * Called by APP_INITIALIZER to restore session on app startup
   */
  async initialize(): Promise<void> {
    const token = localStorage.getItem('session_token');

    if (token) {
      try {
        this.authStore.setLoading(true);

        // Vérifier si le token est valide et récupérer les données utilisateur
        const userData = await this.authApi.checkSession();

        this.authStore.setAuthData(userData, token);
      } catch (error) {
        console.error('Token invalide lors de l\'initialisation:', error);
        this.authApi.clearTokens();
        this.authStore.clearAuth();
      }
    }
  }

  // ===== AUTH OPERATIONS =====

  /**
   * Login with credentials
   */
  async login(credentials: LoginCredentials): Promise<void> {
    // console.log(chalk.green('[FACADE] - login() called'));

    this.authStore.clearError();
    this.authStore.setLoading(true);

    try {
      // 1. Appel API (qui stocke automatiquement les tokens dans localStorage)
      const response = await this.authApi.login(credentials);
      // console.log(chalk.green('[FACADE] - login() response:', JSON.stringify(response, null, 2)));

      // 2. Vérifier que la réponse contient les données nécessaires
      if (!response.sessionToken) {
        throw new Error('Format de réponse invalide : sessionToken manquant');
      }

      // 3. Construire l'objet User
      const user: User = {
        user: {
          firstname: response.firstname!,
          lastname: response.lastname!,
          avatar: response.avatar
        }
      };

      // 4. Mise à jour du store
      this.authStore.setAuthData(user, response.sessionToken, response.refreshToken || null);

      // console.log(chalk.green('[FACADE] - login() success - User:', user));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Échec de connexion';
      this.authStore.setError(errorMessage);
      throw error;
    }
  }

  /**
   * Sign in with nickname and email
   */
  async signIn(credentials: SignInCredentials): Promise<void> {
    this.authStore.clearError();
    this.authStore.setLoading(true);

    try {
      await this.authApi.signIn(credentials);
      this.authStore.setLoading(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Échec de l\'inscription';
      this.authStore.setError(errorMessage);
      throw error;
    }
  }

  /**
   * Confirm signup with token and password
   */
  async confirmSignup(credentials: ConfirmSignupCredentials): Promise<void> {
    this.authStore.clearError();
    this.authStore.setLoading(true);

    try {
      await this.authApi.confirmSignup(credentials);
      this.authStore.setLoading(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Échec de la confirmation';
      this.authStore.setError(errorMessage);
      throw error;
    }
  }

  /**
   * Login with Google
   */
  async loginWithGoogle(): Promise<string> {
    this.authStore.clearError();
    this.authStore.setLoading(true);

    try {
      const response = await this.authApi.getGoogleAuthUrl();
      this.authStore.setLoading(false);
      return response.authUrl;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Échec de connexion avec Google';
      this.authStore.setError(errorMessage);
      throw error;
    }
  }

  /**
   * Logout
   */
  async logout(): Promise<void> {
    this.authStore.clearError();
    this.authStore.setLoading(true);

    try {
      // L'API supprime les tokens de localStorage
      await this.authApi.logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      this.authStore.clearAuth();
      this.authStore.clearProfile();
    }
  }

  /**
   * Forgot password
   */
  async forgotPassword(email: string): Promise<void> {
    this.authStore.clearError();
    this.authStore.setLoading(true);

    try {
      await this.authApi.forgotPassword(email);
      this.authStore.setLoading(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Échec de la demande de réinitialisation';
      this.authStore.setError(errorMessage);
      throw error;
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(credentials: { token: string; password: string }): Promise<void> {
    this.authStore.clearError();
    this.authStore.setLoading(true);

    try {
      await this.authApi.resetPassword(credentials);
      this.authStore.setLoading(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Échec de la réinitialisation';
      this.authStore.setError(errorMessage);
      throw error;
    }
  }

  /**
   * Get user profile
   */
  async getProfile(): Promise<ProfileResponse> {
    this.authStore.setProfileLoading(true);

    try {
      // 1. Appel API
      const profileData = await this.authApi.getProfile();

      // 2. Mise à jour du store
      this.authStore.setProfile(profileData);

      return profileData;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Impossible de charger le profil';
      this.authStore.setProfileError(errorMessage);
      throw error;
    }
  }

  /**
   * Clear authentication error
   */
  clearError(): void {
    this.authStore.clearError();
  }
}
