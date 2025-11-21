import { Injectable, Signal, computed, effect, inject, signal } from '@angular/core';
import { AuthApi } from '@services/api/auth-api.service';
import { AuthState, LoginCredentials, SignInCredentials, ConfirmSignupCredentials, User, ProfileResponse } from '@models/auth.model';
import chalk from "chalk";
@Injectable({
  providedIn: 'root'
})
export class AuthStore {
  private authApi = inject(AuthApi);

  // Initial state (VERSION JWT)
  private state = signal<AuthState>({ user: null, sessionToken: null, refreshToken: null, isLoading: false, error: null });

  // Profile state (separate from auth state)
  private profileState = signal<{ profile: ProfileResponse | null; isLoading: boolean; error: string | null }>({
    profile: null,
    isLoading: false,
    error: null
  });

  // Exposed selectors
  readonly user: Signal<User | null> = computed(() => this.state().user);
  readonly sessionToken: Signal<string | null> = computed(() => this.state().sessionToken);
  readonly refreshToken: Signal<string | null> = computed(() => this.state().refreshToken);
  readonly isLoading: Signal<boolean> = computed(() => this.state().isLoading);
  readonly error: Signal<string | null> = computed(() => this.state().error);
  readonly isAuthenticated: Signal<boolean> = computed(() => !!localStorage.getItem('session_token'));

  // Profile selectors
  readonly profile: Signal<ProfileResponse | null> = computed(() => this.profileState().profile);
  readonly profileLoading: Signal<boolean> = computed(() => this.profileState().isLoading);
  readonly profileError: Signal<string | null> = computed(() => this.profileState().error);

  constructor() {
    // Effect to handle actions after authentication state updates
    effect(() => {
      const user = this.user();
      const error = this.error();

      if (user && !error) {
        // Post-login actions can be handled here
      }
    });
  }







  /**
   * Initialize authentication state from JWT token in localStorage
   * Called by APP_INITIALIZER to restore session on app startup
   */
  async initialize(): Promise<void> {
    const token = localStorage.getItem('session_token');

    if (token) {
      try {
        this.state.update(state => ({
          ...state,
          sessionToken: token,
          isLoading: true
        }));

        // Vérifier si le token est valide
        await this.checkSession();
      } catch (error) {
        console.error('Erreur lors de la vérification du token:', error);
        // Token invalide, on le supprime
        localStorage.removeItem('token');
      }
    }
  }








  /**
   * Connection with credentials (VERSION JWT)
   * Le token est stocké dans localStorage par l'AuthApi
   * @param credentials connection credentials
   */
  async login(credentials: LoginCredentials): Promise<void> {
    console.log(chalk.yellow('[STORE] - login() called :'));
    this.clearError();
    this.state.update(state => ({ ...state, isLoading: true }));

    try {
      const response = await this.authApi.login(credentials);
      console.log(chalk.yellow('[STORE] - login() - reponse complète :', JSON.stringify(response, null, 2)));

      // Support des deux formats de réponse
      let userData: { firstname: string; lastname: string; avatar?: string };
      let token: string;

      if (response.data && (response.token || response.sessionToken)) {
        // Nouveau format : { data: {...}, token: "..." }
        userData = response.data;
        token = response.token || response.sessionToken!;
      } else if (response.firstname && response.sessionToken) {
        // Ancien format : { firstname: "...", sessionToken: "..." }
        userData = {
          firstname: response.firstname,
          lastname: response.lastname!,
          avatar: response.avatar
        };
        token = response.sessionToken;
      } else {
        console.error(chalk.red('[STORE] - Structure de réponse invalide'));
        console.error(chalk.red('[STORE] - Reçu:', response));
        throw new Error('Format de réponse invalide du serveur');
      }

      const user: User = {
        user: {
          firstname: userData.firstname,
          lastname: userData.lastname,
          avatar: userData.avatar,
        }
      };
      console.log(chalk.yellow('[STORE] - login() - user :', user));

      this.state.update(state => ({
        ...state,
        user,
        sessionToken: token,
        refreshToken: response.refreshToken || null,
        isLoading: false,
        error: null
      }));

    } catch (error) {
      this.state.update(state => ({ ...state, isLoading: false, error: error instanceof Error ? error.message : 'Échec de connexion' }));
      throw error;
    }
  }










  /**
   * Sign in with nickname and email
   * @param credentials SignInCredentials (nickname, email)
   */
  async signIn(credentials: SignInCredentials): Promise<void> {
    this.clearError();
    this.state.update(state => ({ ...state, isLoading: true }));

    try {
      await this.authApi.signIn(credentials);
      this.state.update(state => ({ ...state, isLoading: false, error: null }));
    } catch (error) {
      this.state.update(state => ({ 
        ...state, 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Échec de l\'inscription' 
      }));
      throw error;
    }
  }









  /**
   * Confirm signup with token and password
   * @param credentials ConfirmSignupCredentials (token, password)
   */
  async confirmSignup(credentials: ConfirmSignupCredentials): Promise<void> {
    this.clearError();
    this.state.update(state => ({ ...state, isLoading: true }));

    try {
      await this.authApi.confirmSignup(credentials);
      this.state.update(state => ({ ...state, isLoading: false, error: null }));
    } catch (error) {
      this.state.update(state => ({ 
        ...state, 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Échec de la confirmation' 
      }));
      throw error;
    }
  }






  /**
   * Connection with Google
   * @returns the Google authentication URL
   */
  async loginWithGoogle(): Promise<string> {
    this.clearError();
    this.state.update(state => ({ ...state, isLoading: true }));

    try {
      const response = await this.authApi.getGoogleAuthUrl();
      this.state.update(state => ({ ...state, isLoading: false }));
      return response.authUrl;
    } catch (error) {
      this.state.update(state => ({ ...state, isLoading: false, error: error instanceof Error ? error.message : 'Échec de connexion avec Google' }));
      throw error;
    }
  }




  /**
   * Logout the user
   */
  async logout(): Promise<void> {
    this.clearError();
    this.state.update(state => ({ ...state, isLoading: true }));

    try {
      await this.authApi.logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      this.clearTokens();
      this.state.update(state => ({
        ...state,
        user: null,
        sessionToken: null,
        refreshToken: null,
        isLoading: false
      }));
    }
  }







  /**
   * Check the authentication status of the user (VERSION JWT)
   */
  private async checkSession(): Promise<void> {
    console.log(chalk.yellow('[STORE] - checkSession() called'));
    try {
      const token = localStorage.getItem('session_token');

      // Appeler l'API pour vérifier le token et récupérer les données utilisateur
      const user = await this.authApi.checkSession();
      console.log('\x1b[33m[STORE] - checkSession() - user : \x1b[0m', user);

      // Mettre à jour l'état avec les données utilisateur
      this.state.update(state => ({
        ...state,
        user,
        sessionToken: token,
        refreshToken: null,
        isLoading: false
      }));
    } catch (error) {
      // Token invalide, on nettoie tout
      this.clearTokens();
      this.state.update(state => ({
        ...state,
        user: null,
        sessionToken: null,
        refreshToken: null,
        isLoading: false
      }));
    }
  }






  /**
   * Clear authentication error
   */
  clearError(): void {
    this.state.update(state => ({ ...state, error: null }));
  }










  /**
   * Clear authentication tokens (VERSION JWT)
   * Supprime les tokens du localStorage
   */
  private clearTokens(): void {
    localStorage.removeItem('session_token');
    localStorage.removeItem('refresh_token');
  }







  /**
   * Forgot password - request password reset
   * @param email User's email address
   */
  public async forgotPassword(email: string): Promise<void> {
    this.clearError();
    this.state.update(state => ({ ...state, isLoading: true }));

    try {
      await this.authApi.forgotPassword(email);
      this.state.update(state => ({ ...state, isLoading: false, error: null }));
    } catch (error) {
      this.state.update(state => ({ ...state, isLoading: false,
        error: error instanceof Error ? error.message : 'Échec de la demande de réinitialisation'
      }));
      throw error;
    }
  }






  
  /**
   * Reset password with token
   * @param credentials ResetPasswordCredentials (token, password)
   */
 public async resetPassword(credentials: { token: string; password: string }): Promise<void> {
    this.clearError();
    this.state.update(state => ({ ...state, isLoading: true }));

    try {
      await this.authApi.resetPassword(credentials);
      this.state.update(state => ({ ...state, isLoading: false, error: null }));
    } catch (error) {
      this.state.update(state => ({ ...state, isLoading: false,
        error: error instanceof Error ? error.message : 'Échec de la réinitialisation'
      }));
      throw error;
    }
  }

  /**
   * Get user profile
   * Calls API first, then persists data in store
   */
  public async getProfile(): Promise<ProfileResponse> {
    this.profileState.update(state => ({ ...state, isLoading: true, error: null }));

    try {
      const profileData = await this.authApi.getProfile();
      this.profileState.update(state => ({
        ...state,
        profile: profileData,
        isLoading: false,
        error: null
      }));
      return profileData;
    } catch (error) {
      this.profileState.update(state => ({
        ...state,
        profile: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Impossible de charger le profil'
      }));
      throw error;
    }
  }
}