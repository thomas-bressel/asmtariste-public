import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeoService } from '@services/seo.service';
import { AuthService } from '@services/auth.service';
import { USER_API_URI } from 'src/app/shared/config-api';

@Component({
  selector: 'div[app-profile]',
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  public baseUrl = USER_API_URI;

  private authService = inject(AuthService);
  private seo = inject(SeoService);

  // Exposer les signals du service
  profile = this.authService.profile;
  isLoading = this.authService.profileLoading;
  error = this.authService.profileError;

  async ngOnInit(): Promise<void> {
    this.seo.updateSeo({
      title: 'Mon Profil - ASMtariSTe.fr',
      description: 'Gérez votre profil sur ASMtariSTe.fr',
      keywords: 'profil, utilisateur, compte',
    });

    await this.loadProfile();
  }

  private async loadProfile(): Promise<void> {
    try {
      const profileData = await this.authService.getProfile();
      // console.log('[COMPONENT] - loadProfile()', profileData)
    } catch (err) {
      console.error('Erreur lors du chargement du profil:', err);
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
