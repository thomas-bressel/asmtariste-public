import { Injectable, signal, computed } from '@angular/core';
import { UserPublicData } from '@models/user.model';

/**
 * USER STORE SERVICE - Pure State Management for Users
 *
 * This store service manages user state using Angular Signals.
 * It is a pure state management service with NO side effects or API calls.
 *
 * RULES:
 * - NEVER call APIs directly
 * - Only manage state and expose signals
 * - Called EXCLUSIVELY by the facade service
 *
 * @remarks
 * This service provides read-only signals for user collections with computed
 * signals for user count and other derived state.
 */
@Injectable({
  providedIn: 'root'
})
export class UserStore {
  // ===== PRIVATE STATE =====
  /**
   * Private writable signal containing the array of all users
   */
  private readonly _users = signal<UserPublicData[]>([]);

  /**
   * Private writable signal for loading state
   */
  private readonly _loading = signal(false);

  /**
   * Private writable signal for error messages
   */
  private readonly _error = signal<string | null>(null);

  // ===== PUBLIC READ-ONLY SIGNALS =====
  /**
   * Read-only signal exposing the users array
   */
  readonly users = this._users.asReadonly();

  /**
   * Read-only signal exposing the loading state
   */
  readonly loading = this._loading.asReadonly();

  /**
   * Read-only signal exposing error messages
   */
  readonly error = this._error.asReadonly();

  // ===== COMPUTED SIGNALS =====
  /**
   * Computed signal that calculates the total number of users
   * @returns The count of users in the store
   */
  readonly usersCount = computed(() => this._users().length);

  // ===== STATE MUTATIONS =====
  /**
   * Sets the users array and clears any existing errors
   * @param users - Array of user data to store
   */
  setUsers(users: UserPublicData[]): void {
    this._users.set(users);
    this._error.set(null);
  }

  /**
   * Sets the loading state
   * @param loading - Boolean indicating if an operation is in progress
   */
  setLoading(loading: boolean): void {
    this._loading.set(loading);
  }

  /**
   * Sets an error message
   * @param error - The error message to set, or null to clear errors
   */
  setError(error: string | null): void {
    this._error.set(error);
  }

  /**
   * Clears all store data and resets to initial state
   */
  clearStore(): void {
    this._users.set([]);
    this._loading.set(false);
    this._error.set(null);
  }
}