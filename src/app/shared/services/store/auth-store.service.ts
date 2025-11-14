import { Injectable, Signal, computed, effect, inject, signal } from '@angular/core';
import { AuthApi } from '@services/api/auth-api.service';
import { AuthState, LoginCredentials, User } from '@models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthStore {
  private authApi = inject(AuthApi);

  // Intial state
  private state = signal<AuthState>({ user: null, sessionToken: null, refreshToken: null, isLoading: false, error: null });

  // Exposed selectors
  readonly user: Signal<User | null> = computed(() => this.state().user);
  readonly sessionToken: Signal<string | null> = computed(() => this.state().sessionToken);
  readonly refreshToken: Signal<string | null> = computed(() => this.state().refreshToken);
  readonly isLoading: Signal<boolean> = computed(() => this.state().isLoading);
  readonly error: Signal<string | null> = computed(() => this.state().error);
  readonly isAuthenticated: Signal<boolean> = computed(() => !!this.state().sessionToken);

  constructor() {
    // Check for existing token in localStorage
    const sessionToken = localStorage.getItem('session_token');
    const refreshToken = localStorage.getItem('refresh_token');
    const userJson = localStorage.getItem('user_data');

    if (sessionToken && refreshToken) {
      const user = userJson ? JSON.parse(userJson) : null;
      this.state.update(state => ({ 
        ...state, 
        sessionToken, 
        refreshToken, 
        user, 
        isLoading: true }));

      // Check if the token is valid
      this.checkAuth();
    }

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
   * Connection with credentials
   * @param credentials connection credentials
   */
  async login(credentials: LoginCredentials): Promise<void> {
    this.clearError();
    this.state.update(state => ({ ...state, isLoading: true }));

    try {
      const response = await this.authApi.login(credentials);

      const user: User = {
        firstname: response.firstname,
        lastname: response.lastname,
        avatar: response.avatar,
      };
            this.setAuthData(response.sessionToken, response.refreshToken, user);


      this.state.update(state => ({
        ...state,
        user,
        sessionToken: response.sessionToken,
        refreshToken: response.refreshToken,
        isLoading: false,
        error: null
      }));

    } catch (error) {
      this.state.update(state => ({ ...state, isLoading: false, error: error instanceof Error ? error.message : 'Échec de connexion' }));
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
   * Check the authentication status of the user
   */
  private async checkAuth(): Promise<void> {
    try {
      await this.authApi.checkSession();

      this.state.update(state => ({ ...state, isLoading: false }));
    } catch (error) {
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
   * Set authentication tokens
   * @param sessionToken Session token to store
   * @param refreshToken Refresh token to store
   * @param user User data to store
   */
  private setAuthData(sessionToken: string, refreshToken: string, user: User): void {
  localStorage.setItem('session_token', sessionToken);
  localStorage.setItem('refresh_token', refreshToken);
  localStorage.setItem('user_data', JSON.stringify(user));
}





  /**
   * Clear authentication tokens
   */
  private clearTokens(): void {
    localStorage.removeItem('session_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
  }
}