import { Component, OnInit, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { AuthApi } from '@services/api/auth-api.service';

@Component({
  selector: 'app-setup-password',
  templateUrl: './setup-password.html',
  styleUrls: ['./setup-password.scss'],
  imports: [ReactiveFormsModule]
})
export class SetupPassword implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authApi = inject(AuthApi);
  public auth = inject(AuthService);

  public token = signal<string>('');
  public nickname = signal<string>('');
  public email = signal<string>('');
  public showPassword = signal<boolean>(false);
  public showConfirmPassword = signal<boolean>(false);

  signupForm!: FormGroup;

  ngOnInit(): void {
    this.token.set(this.route.snapshot.queryParamMap.get('session') || '');

    this.signupForm = this.fb.nonNullable.group({
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
   * 
   */
  private async loadTokenInfo(): Promise<void> {
    try {
      const response = await this.authApi.validateSignupToken(this.token());
      if (response.valid && response.nickname && response.email) {
        this.nickname.set(response.nickname);
        this.email.set(response.email);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des informations:', error);
    }
  }






  /**
   *
   * @param control
   * @returns
   */
  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }






  /**
   * 
   * @param group 
   * @returns 
   */
  public togglePasswordVisibility(): void {
    this.showPassword.update(v => !v);
  }






  /**
   * 
   * @param group 
   * @returns 
   */
  public toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword.update(v => !v);
  }






  /**
   * 
   * @param group 
   * @returns 
   */
  public async handleSubmit(): Promise<void> {
    if (this.signupForm.invalid || this.auth.isLoading()) return;

    try {
      const credentials = {
        token: this.token(),
        password: this.signupForm.value.password
      };

      await this.auth.confirmSignup(credentials);
      
      this.router.navigate(['/accueil']).then(() => {
        alert('Inscription finalisée avec succès ! Vous pouvez maintenant vous connecter.');
      });
    } catch (error) {
      console.error('Erreur lors de la finalisation:', error);
    }
  }
}