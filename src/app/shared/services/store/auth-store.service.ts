import { Injectable, Signal, computed, signal } from '@angular/core';
import { User, ProfileResponse } from '@models/auth.model';

/**
 * AUTH STORE - Pure State Management
 *
 * RÈGLES:
 * - NE JAMAIS appeler d'API
 * - NE JAMAIS manipuler localStorage
 * - Seulement gérer l'état et exposer des signals
 * - Appelé UNIQUEMENT par le facade service
 */

interface AuthState {
  user: User | null;
  sessionToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
}

interface ProfileState {
  profile: ProfileResponse | null;
  isLoading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthStore {
  // ===== STATE =====
  private authState = signal<AuthState>({
    user: null,
    sessionToken: null,
    refreshToken: null,
    isLoading: false,
    error: null
  });

  private profileState = signal<ProfileState>({
    profile: null,
    isLoading: false,
    error: null
  });

  // ===== SELECTORS (READ-ONLY) =====
  readonly user: Signal<User | null> = computed(() => this.authState().user);
  readonly sessionToken: Signal<string | null> = computed(() => this.authState().sessionToken);
  readonly refreshToken: Signal<string | null> = computed(() => this.authState().refreshToken);
  readonly isLoading: Signal<boolean> = computed(() => this.authState().isLoading);
  readonly error: Signal<string | null> = computed(() => this.authState().error);
  readonly isAuthenticated: Signal<boolean> = computed(() => !!this.authState().sessionToken && !!this.authState().user);

  readonly profile: Signal<ProfileResponse | null> = computed(() => this.profileState().profile);
  readonly profileLoading: Signal<boolean> = computed(() => this.profileState().isLoading);
  readonly profileError: Signal<string | null> = computed(() => this.profileState().error);

  // ===== MUTATIONS (appelées uniquement par le facade) =====

  setLoading(isLoading: boolean): void {
    this.authState.update(state => ({ ...state, isLoading }));
  }

  setError(error: string | null): void {
    this.authState.update(state => ({ ...state, error, isLoading: false }));
  }

  clearError(): void {
    this.authState.update(state => ({ ...state, error: null }));
  }

  setAuthData(user: User, sessionToken: string, refreshToken: string | null = null): void {
    this.authState.update(state => ({
      ...state,
      user,
      sessionToken,
      refreshToken,
      isLoading: false,
      error: null
    }));
  }

  clearAuth(): void {
    this.authState.set({
      user: null,
      sessionToken: null,
      refreshToken: null,
      isLoading: false,
      error: null
    });
  }

  setProfileLoading(isLoading: boolean): void {
    this.profileState.update(state => ({ ...state, isLoading }));
  }

  setProfileError(error: string | null): void {
    this.profileState.update(state => ({ ...state, error, isLoading: false }));
  }

  setProfile(profile: ProfileResponse): void {
    this.profileState.update(state => ({
      ...state,
      profile,
      isLoading: false,
      error: null
    }));

    // Met à jour aussi l'avatar de l'utilisateur dans authState
    if (this.authState().user && profile.data.avatar) {
      this.authState.update(state => ({
        ...state,
        user: state.user ? {
          user: {
            ...state.user.user,
            avatar: profile.data.avatar
          }
        } : null
      }));
    }
  }

  clearProfile(): void {
    this.profileState.set({
      profile: null,
      isLoading: false,
      error: null
    });
  }
}
<<<<<<< HEAD





  /**
   * Clear authentication tokens
   */
  private clearTokens(): void {
    localStorage.removeItem('session_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
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
=======
>>>>>>> deploy
