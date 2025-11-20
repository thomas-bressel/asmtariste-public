import { Injectable, Signal, inject } from '@angular/core';
import { AuthStore } from '@services/store/auth-store.service';
import { LoginCredentials, SignInCredentials, ConfirmSignupCredentials, User, ProfileResponse } from '@models/auth.model';

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

  // Profile selectors
  get profile(): Signal<ProfileResponse | null> {
    return this.authStore.profile;
  }

  get profileLoading(): Signal<boolean> {
    return this.authStore.profileLoading;
  }

  get profileError(): Signal<string | null> {
    return this.authStore.profileError;
  }

  /**
   * Connexion avec identifiants
   */
  async login(credentials: LoginCredentials): Promise<void> {
    return this.authStore.login(credentials);
  }






  
  /**
 * Inscription avec nickname et email
 */
  async signIn(credentials: SignInCredentials): Promise<void> {
    return this.authStore.signIn(credentials);
  }






  
    /**
   * Confirmer l'inscription avec token et password
   */
  async confirmSignup(credentials: ConfirmSignupCredentials): Promise<void> {
    return this.authStore.confirmSignup(credentials);
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






  
  /**
   * Demander la réinitialisation du mot de passe
   */
  async forgotPassword(email: string): Promise<void> {
    return this.authStore.forgotPassword(email);
  }







  /**
   * Réinitialiser le mot de passe avec token
   */
  async resetPassword(credentials: { token: string; password: string }): Promise<void> {
    return this.authStore.resetPassword(credentials);
  }

  /**
   * Récupérer le profil complet de l'utilisateur
   */
  async getProfile(): Promise<ProfileResponse> {
    return this.authStore.getProfile();
  }
}