import { Component, OnInit, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { AuthApi } from '@services/api/auth-api.service';

@Component({
  selector: 'app-reinit-password',
  templateUrl: './reinit-password.html',
  styleUrls: ['./reinit-password.scss'],
  imports: [ReactiveFormsModule]
})
export class ReinitPassword implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authApi = inject(AuthApi);
  public auth = inject(AuthService);

  public token = signal<string>('');
  public email = signal<string>('');
  public showPassword = signal<boolean>(false);
  public showConfirmPassword = signal<boolean>(false);

  resetPasswordForm!: FormGroup;

  ngOnInit(): void {
    this.token.set(this.route.snapshot.queryParamMap.get('session') || '');

    this.resetPasswordForm = this.fb.nonNullable.group({
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      ]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });

    this.loadTokenInfo();
  }




  /**
   * Charger les informations du token
   */
  private async loadTokenInfo(): Promise<void> {
    try {
      const response = await this.authApi.validateResetToken(this.token());
      if (response.valid && response.email) {
        this.email.set(response.email);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des informations:', error);
      this.router.navigate(['/accueil']);
    }
  }




  /**
   * Validateur pour vérifier que les mots de passe correspondent
   * @param control
   * @returns
   */
  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }




  /**
   * Afficher/masquer le mot de passe
   */
  public togglePasswordVisibility(): void {
    this.showPassword.update(v => !v);
  }




  /**
   * Afficher/masquer la confirmation du mot de passe
   */
  public toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword.update(v => !v);
  }




  /**
   * Soumettre le formulaire de réinitialisation
   */
  public async handleSubmit(): Promise<void> {
    if (this.resetPasswordForm.invalid || this.auth.isLoading()) return;

    try {
      const credentials = {
        token: this.token(),
        password: this.resetPasswordForm.value.password
      };

      await this.auth.resetPassword(credentials);

      this.router.navigate(['/accueil']).then(() => {
        alert('Mot de passe réinitialisé avec succès ! Vous pouvez maintenant vous connecter.');
      });
    } catch (error) {
      console.error('Erreur lors de la réinitialisation:', error);
    }
  }
}
