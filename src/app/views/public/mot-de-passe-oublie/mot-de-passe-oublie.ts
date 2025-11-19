import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-mot-de-passe-oublie',
  templateUrl: './mot-de-passe-oublie.html',
  styleUrls: ['./mot-de-passe-oublie.scss'],
  imports: [ReactiveFormsModule]
})
export class MotDePasseOublie {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  public auth = inject(AuthService);

  public emailSent = signal<boolean>(false);
  public isSubmitting = signal<boolean>(false);

  forgotPasswordForm!: FormGroup;

  ngOnInit(): void {
    this.forgotPasswordForm = this.fb.nonNullable.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  /**
   * Soumettre la demande de réinitialisation
   */
  public async handleSubmit(): Promise<void> {
    if (this.forgotPasswordForm.invalid || this.isSubmitting()) return;

    this.isSubmitting.set(true);
    this.auth.clearError();

    try {
      await this.auth.forgotPassword(this.forgotPasswordForm.value.email);
      this.emailSent.set(true);
    } catch (error) {
      console.error('Erreur lors de la demande de réinitialisation:', error);
    } finally {
      this.isSubmitting.set(false);
    }
  }

  /**
   * Retour à la page d'accueil
   */
  public goHome(): void {
    this.router.navigate(['/accueil']);
  }
}
