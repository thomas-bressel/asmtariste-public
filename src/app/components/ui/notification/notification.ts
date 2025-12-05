import { Component, inject } from '@angular/core';
import { NotificationService, Notification } from '@services/ui/notification.service';
import { CommonModule } from '@angular/common';

/**
 * Composant de notification UI pour afficher les messages à l'utilisateur.
 *
 * Ce composant affiche une liste de notifications en haut à droite de l'écran
 * avec des animations d'apparition et de disparition. Les notifications sont
 * automatiquement supprimées après leur durée d'affichage.
 *
 * Features:
 * - Affichage en overlay avec position fixe
 * - Support de plusieurs notifications simultanées
 * - Animations CSS pour apparition/disparition
 * - Couleurs différentes selon le type de notification
 * - Bouton de fermeture manuelle
 * - Responsive design
 */
@Component({
  selector: 'app-notification',
  templateUrl: './notification.html',
  styleUrls: ['./notification.scss'],
  imports: [CommonModule]
})
export class NotificationComponent {

  /**
   * Service de gestion des notifications
   */
  public notificationService = inject<NotificationService>(NotificationService);







  /**
   * Ferme une notification spécifique
   *
   * @param id - Identifiant de la notification à fermer
   */
  public close(id: string): void {
    this.notificationService.dismiss(id);
  }







  /**
   * Détermine la classe CSS en fonction du type de notification
   *
   * @param notification - La notification pour laquelle déterminer la classe
   * @returns La classe CSS correspondante au type
   */
  public getNotificationClass(notification: Notification): string {
    // console.log('getNotificationClass')
    return `notification notification--${notification.type}`;
  }
}
