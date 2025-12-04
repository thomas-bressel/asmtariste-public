import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MaintenanceService } from '@services/maintenance.service';

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.html',
  styleUrls: ['./maintenance.scss']
})
export class MaintenancePage {
  public maintenance = inject(MaintenanceService);
  private router = inject(Router);

  /**
   * Récupère le message de maintenance
   */
  get message(): string {
    return this.maintenance.getMaintenanceMessage();
  }

  /**
   * Récupère la date de fin de maintenance si disponible
   */
  get endDate(): string | null | undefined {
    return this.maintenance.getStatus().endDate;
  }

  /**
   * Actualise le statut de maintenance
   * Si la maintenance est désactivée → Redirige vers /accueil
   */
  async refreshStatus(): Promise<void> {
    // console.log('[Maintenance Page] Vérification du statut...');

    // Re-vérifier le statut auprès de l'API
    await this.maintenance.checkStatus();

    // Si la maintenance est désactivée, rediriger vers l'accueil
    if (!this.maintenance.isMaintenanceActive()) {
      // console.log('[Maintenance Page] ✅ Maintenance terminée, redirection...');
      this.router.navigate(['/accueil']);
    } else {
      // console.log('[Maintenance Page] ⚠️ Maintenance toujours active');
    }
  }
}
