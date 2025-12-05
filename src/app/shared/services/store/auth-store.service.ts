import { Injectable, Signal, computed, signal } from '@angular/core';
import { User, ProfileResponse } from '@models/auth.model';

/**
 * Authentication state interface for managing auth-related data
 */
interface AuthState {
  user: User | null;
  sessionToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Profile state interface for managing user profile data
 */
interface ProfileState {
  profile: ProfileResponse | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * AUTH STORE SERVICE - Pure State Management for Authentication
 *
 * This store service manages authentication and profile state using Angular Signals.
 * It is a pure state management service with NO side effects or API calls.
 *
 * RULES:
 * - NEVER call APIs directly
 * - NEVER manipulate localStorage
 * - Only manage state and expose signals
 * - Called EXCLUSIVELY by the facade service
 *
 * @remarks
 * This service uses Angular's signal-based reactivity system to provide
 * read-only computed signals for state access and mutation methods for state updates.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthStore {
  // ===== STATE =====
  /**
   * Private writable signal for authentication state
   * Contains user data, tokens, loading state, and error messages
   */
  private authState = signal<AuthState>({
    user: null,
    sessionToken: null,
    refreshToken: null,
    isLoading: false,
    error: null
  });

  /**
   * Private writable signal for profile state
   * Contains profile data, loading state, and error messages
   */
  private profileState = signal<ProfileState>({
    profile: null,
    isLoading: false,
    error: null
  });

  // ===== SELECTORS (READ-ONLY) =====
  /**
   * Computed signal for the current authenticated user
   * @returns The user object or null if not authenticated
   */
  readonly user: Signal<User | null> = computed(() => this.authState().user);

  /**
   * Computed signal for the session token
   * @returns The session token string or null if not authenticated
   */
  readonly sessionToken: Signal<string | null> = computed(() => this.authState().sessionToken);

  /**
   * Computed signal for the refresh token
   * @returns The refresh token string or null if not available
   */
  readonly refreshToken: Signal<string | null> = computed(() => this.authState().refreshToken);

  /**
   * Computed signal for the authentication loading state
   * @returns True if an authentication operation is in progress
   */
  readonly isLoading: Signal<boolean> = computed(() => this.authState().isLoading);

  /**
   * Computed signal for authentication error messages
   * @returns The error message string or null if no error
   */
  readonly error: Signal<string | null> = computed(() => this.authState().error);

  /**
   * Computed signal that determines if the user is authenticated
   * @returns True if both session token and user are present
   */
  readonly isAuthenticated: Signal<boolean> = computed(() => !!this.authState().sessionToken && !!this.authState().user);

  /**
   * Computed signal for the user profile data
   * @returns The profile response object or null if not loaded
   */
  readonly profile: Signal<ProfileResponse | null> = computed(() => this.profileState().profile);

  /**
   * Computed signal for the profile loading state
   * @returns True if a profile operation is in progress
   */
  readonly profileLoading: Signal<boolean> = computed(() => this.profileState().isLoading);

  /**
   * Computed signal for profile error messages
   * @returns The error message string or null if no error
   */
  readonly profileError: Signal<string | null> = computed(() => this.profileState().error);

  // ===== MUTATIONS (called exclusively by the facade service) =====

  /**
   * Sets the loading state for authentication operations
   * @param isLoading - Boolean indicating if an operation is in progress
   */
  setLoading(isLoading: boolean): void {
    this.authState.update(state => ({ ...state, isLoading }));
  }

  /**
   * Sets an error message and clears the loading state
   * @param error - The error message to set, or null to clear errors
   */
  setError(error: string | null): void {
    this.authState.update(state => ({ ...state, error, isLoading: false }));
  }

  /**
   * Clears any authentication error messages
   */
  clearError(): void {
    this.authState.update(state => ({ ...state, error: null }));
  }

  /**
   * Sets the complete authentication data including user and tokens
   * Clears loading state and errors upon successful update
   * @param user - The authenticated user object
   * @param sessionToken - The session token for the current session
   * @param refreshToken - Optional refresh token for token renewal
   */
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

  /**
   * Clears all authentication data and resets state to initial values
   * Used during logout operations
   */
  clearAuth(): void {
    this.authState.set({
      user: null,
      sessionToken: null,
      refreshToken: null,
      isLoading: false,
      error: null
    });
  }

  /**
   * Sets the loading state for profile operations
   * @param isLoading - Boolean indicating if a profile operation is in progress
   */
  setProfileLoading(isLoading: boolean): void {
    this.profileState.update(state => ({ ...state, isLoading }));
  }

  /**
   * Sets a profile error message and clears the loading state
   * @param error - The error message to set, or null to clear errors
   */
  setProfileError(error: string | null): void {
    this.profileState.update(state => ({ ...state, error, isLoading: false }));
  }

  /**
   * Sets the user profile data and synchronizes avatar with auth state
   * Also updates the user's avatar in the authState if available
   * @param profile - The complete profile response object
   */
  setProfile(profile: ProfileResponse): void {
    this.profileState.update(state => ({
      ...state,
      profile,
      isLoading: false,
      error: null
    }));

    // Also updates the user's avatar in authState
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

  /**
   * Clears all profile data and resets profile state to initial values
   */
  clearProfile(): void {
    this.profileState.set({
      profile: null,
      isLoading: false,
      error: null
    });
  }
}
