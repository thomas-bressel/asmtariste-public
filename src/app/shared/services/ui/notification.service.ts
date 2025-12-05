import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Types de notification supportés
 */
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

/**
 * Structure d'une notification
 */
export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  duration: number;
}

/**
 * Clés prédéfinies pour les messages de notification
 */
export type NotificationKey =
  | 'registration.success'
  | 'confirm.success'
  | 'confirm.error'
  | 'reinit.success'
  | 'reinit.error'
  | 'registration.error'
  | 'login.success'
  | 'login.error'
  | 'logout.success'
  | 'profile.updated'
  | 'profile.error'
  | 'generic.error'
  | 'generic.success'
  | 'access.error'
  | 'file.error'
  ;

/**
 * Service de gestion des notifications UI.
 *
 * Ce service permet d'afficher des messages à l'utilisateur de manière élégante
 * en utilisant des clés prédéfinies ou des messages personnalisés.
 *
 * Features:
 * - Messages prédéfinis avec clés pour faciliter l'utilisation
 * - Support de différents types de notifications (success, error, warning, info)
 * - Durée d'affichage configurable
 * - File de notifications avec gestion automatique
 * - Auto-dismiss après le délai spécifié
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationService {


  private readonly router = inject(Router)


  /**
   * Signal contenant la liste des notifications actives
   */
  public notifications = signal<Notification[]>([]);

  /**
   * Messages prédéfinis associés à chaque clé
   */
  private readonly messages: Record<NotificationKey, { message: string; type: NotificationType }> = {
    'registration.success': {
      message: '✓ Un email de confirmation vous a été envoyé. Consultez votre boîte mail pour finaliser votre inscription.',
      type: 'success'
    },
    'confirm.success': {
      message: '✓ Inscription finalisée avec succès ! Vous pouvez maintenant vous connecter.',
      type: 'success'
    },
    'confirm.error': {
      message: '✓ L\'inscription a échouée ! contactez l\'administrateur pour savoir ce qui s\'est passé : contact@asmtariste.fr .',
      type: 'error'
    },
    'reinit.success': {
      message: '✓ Mot de passe réinitialisé avec succès ! Vous pouvez maintenant vous connecter.',
      type: 'success'
    },
    'reinit.error': {
      message: '✓ La réinitialisation du mot de passe à échouée ! contactez l\'administrateur pour savoir ce qui s\'est passé : contact@asmtariste.fr .',
      type: 'error'
    },
    'registration.error': {
      message: '✗ Une erreur est survenue lors de l\'inscription. Veuillez réessayer.',
      type: 'error'
    },
    'login.success': {
      message: '✓ Connexion réussie ! Bienvenue sur ASMtariSTe, redirection en cours ....',
      type: 'success'
    },
    'login.error': {
      message: '✗ Identifiants incorrects. Veuillez réessayer.',
      type: 'error'
    },
    'logout.success': {
      message: '✓ Vous avez été déconnecté avec succès.',
      type: 'success'
    },
    'profile.updated': {
      message: '✓ Votre profil a été mis à jour avec succès.',
      type: 'success'
    },
    'profile.error': {
      message: '✗ Une erreur est survenue lors de la mise à jour du profil.',
      type: 'error'
    },
    'generic.error': {
      message: '✗ Une erreur est survenue. Veuillez réessayer.',
      type: 'error'
    },
    'generic.success': {
      message: '✓ Opération réussie !',
      type: 'success'
    },
    'access.error': {
      message: '✓ Acces refusé. Vous avez besoin d\'un abonnement supérieur pour accéder à ce fichier',
      type: 'error'
    },
    'file.error': {
      message: '✓ Fichier inexistant !',
      type: 'error'
    }
  };

  /**
   * Affiche une notification en utilisant une clé prédéfinie
   *
   * @param key - Clé du message prédéfini
   * @param duration - Durée d'affichage en millisecondes (par défaut: 5000ms)
   *
   * @example
   * ```typescript
   * this.notificationService.show('registration.success');
   * this.notificationService.show('login.error', 3000);
   * ```
   */
  public show(key: NotificationKey, duration: number = 5000, isRedirect: boolean = false): void {
    // console.log('Show notification')
    const config = this.messages[key];
    if (!config) {
      console.warn(`Notification key "${key}" not found`);
      return;
    }

    this.showCustom(config.message, config.type, duration);


  }

  /**
   * Affiche une notification avec un message personnalisé
   *
   * @param message - Message à afficher
   * @param type - Type de notification (success, error, warning, info)
   * @param duration - Durée d'affichage en millisecondes (par défaut: 5000ms)
   *
   * @example
   * ```typescript
   * this.notificationService.showCustom('Action terminée', 'success');
   * this.notificationService.showCustom('Attention !', 'warning', 3000);
   * ```
   */
  public showCustom(message: string, type: NotificationType = 'info', duration: number = 5000): void {
    const notification: Notification = { id: this.generateId(), message, type, duration };

    // Ajouter la notification à la liste
    this.notifications.update(notifications => [...notifications, notification]);

    // Supprimer automatiquement après le délai
    setTimeout(() => {
      this.dismiss(notification.id);
      // Reload the homepage to update the content based on authentication state
      this.router.navigateByUrl('/accueil', { replaceUrl: true }).then(() => {
        location.reload();
      });
    }, duration);
  }

  /**
   * Supprime une notification spécifique
   *
   * @param id - Identifiant de la notification à supprimer
   */
  public dismiss(id: string): void {
    this.notifications.update(notifications =>
      notifications.filter(n => n.id !== id)
    );
  }

  /**
   * Supprime toutes les notifications actives
   */
  public dismissAll(): void {
    this.notifications.set([]);
  }

  /**
   * Génère un identifiant unique pour une notification
   *
   * @private
   * @returns Identifiant unique basé sur le timestamp et un nombre aléatoire
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
