import { Component, ViewChild, signal, inject } from '@angular/core';
import { RouterLink } from "@angular/router";
import { LoginModal } from '@components/ui/login-modal/login-modal';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'header[app-header]',
  imports: [RouterLink, LoginModal],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  host: {
    'class': 'header'
  }
})
export class Header  {
    public auth = inject(AuthService);
    public isOpen = signal<boolean>(false);
  
  // Référence au composant login modal
  @ViewChild(LoginModal) loginModal!: LoginModal;
  
  // Variable pour stocker une référence au composant au chargement initial
  private loginModalInstance: LoginModal | null = null;

    // Base URL pour les avatars
  private avatarBaseUrl = 'http://localhost:5002/avatars/';



  /**
   * Toggle the mobile menu
   */
  public toggleMenu(): void {
    this.isOpen.set(!this.isOpen());
  }





  /**
   * Open the login modal
   * @param event Optional event to prevent default
   */
  public openLoginModal(event?: Event): void {
    if (event) event.preventDefault();
    
    // Si on a déjà la référence via ViewChild (après le premier rendu)
    if (this.loginModal) this.loginModal.open();
    
    this.isOpen.set(false); // Ferme le menu mobile si ouvert
  }
  
  
  

/**
   * Déconnexion de l'utilisateur
   */
  public async handleLogout(event?: Event): Promise<void> {
    if (event) {
      event.preventDefault();
    }
    
    try {
      await this.auth.logout();
      this.isOpen.set(false); // Ferme le menu mobile si ouvert
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  }



  
  /**
   * Obtenir l'URL complète de l'avatar
  */
 public getAvatarUrl(): string {
    const user = this.auth.user();
    console.log('User :', user);

    return user?.avatar ? `${this.avatarBaseUrl}${user.avatar}` : '/assets/default-avatar.png';
  }



  /**
   * Obtenir le nom complet de l'utilisateur
   */
  public getUserFullName(): string {
    const user = this.auth.user();
    return user ? `${user.firstname} ${user.lastname}` : '';
  }




}