import { Injectable, Signal, inject } from '@angular/core';
import { AuthStore } from '@services/store/auth-store.service';
import { LoginCredentials, User } from '@models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authStore = inject(AuthStore);
  
  // Exposer les sélecteurs publiquement
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
  
  /**
   * Connexion avec identifiants
   */
  async login(credentials: LoginCredentials): Promise<void> {
    return this.authStore.login(credentials);
  }
  
  /**
   * Connexion avec Google
   */
  async loginWithGoogle(): Promise<string> {
    return this.authStore.loginWithGoogle();
  }
  
  /**
   * Déconnexion
   */
  async logout(): Promise<void> {
    return this.authStore.logout();
  }
  
  /**
   * Effacer les erreurs
   */
  clearError(): void {
    this.authStore.clearError();
  }
}