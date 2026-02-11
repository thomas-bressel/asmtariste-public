import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeoService } from '@services/seo.service';
import { AuthService } from '@services/auth.service';
import { USER_API_URI, USER_STATIC_IMAGES_URI } from 'src/app/shared/config-api';

/**
 * User profile page component for the private area.
 * Route: /profile (requires authentication)
 *
 * @component
 * @description Displays the authenticated user's profile information including avatar,
 * email, nickname, role and account creation date. Loads profile data from AuthService.
 */
@Component({
  selector: 'div[app-profile]',
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  /**
   * Base URL for user API endpoints.
   * @public
   * @type {string}
   */
  // public baseUrl = USER_API_URI;
  public baseUrl = USER_STATIC_IMAGES_URI;

  /**
   * Authentication service for managing user authentication and profile data.
   * @private
   * @type {AuthService}
   */
  private authService = inject(AuthService);

  /**
   * SEO service for managing page metadata.
   * @private
   * @type {SeoService}
   */
  private seo = inject(SeoService);

  /**
   * Signal containing the user's profile data.
   * @public
   */
  profile = this.authService.profile;

  /**
   * Signal indicating whether the profile is currently loading.
   * @public
   */
  isLoading = this.authService.profileLoading;

  /**
   * Signal containing any errors from profile loading.
   * @public
   */
  error = this.authService.profileError;

  /**
   * Lifecycle hook that is called after component initialization.
   * Configures SEO metadata and loads the user's profile data.
   *
   * @returns {Promise<void>}
   */
  async ngOnInit(): Promise<void> {
    this.seo.updateSeo({
      title: 'Mon Profil - ASMtariSTe.fr',
      description: 'Gérez votre profil sur ASMtariSTe.fr',
      keywords: 'profil, utilisateur, compte',
    });

    await this.loadProfile();
  }

  /**
   * Loads the user's profile data from the authentication service.
   *
   * @private
   * @returns {Promise<void>}
   */
  private async loadProfile(): Promise<void> {
    try {
      const profileData = await this.authService.getProfile();
    } catch (err) {
      console.error('Error loading profile:', err);
    }
  }

  /**
   * Formats a date string to French locale format.
   *
   * @param {string} dateString - The date string to format
   * @returns {string} Formatted date string in French locale (e.g., "15 janvier 2024, 14:30")
   */
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
