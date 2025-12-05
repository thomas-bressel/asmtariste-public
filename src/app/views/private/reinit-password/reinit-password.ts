import { Component, OnInit, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';


import { AuthService } from '@services/auth.service';
import { AuthApi } from '@services/api/auth-api.service';
import { NotificationService } from '@services/ui/notification.service';



/**
 * Password reset page component for authenticated password reset flow.
 * Route: /reinit-password (requires valid reset token)
 *
 * @component
 * @description Allows users to set a new password after requesting a password reset.
 * Validates the reset token via AuthApi, displays the associated email, and handles
 * the password reset submission with password strength validation and confirmation matching.
 */
@Component({
  selector: 'app-reinit-password',
  templateUrl: './reinit-password.html',
  styleUrls: ['./reinit-password.scss'],
  imports: [ReactiveFormsModule]
})
export class ReinitPassword implements OnInit {
  /**
 * Notifications service to display notifications.
 * @private
 * @type {NotificationService}
 */
  private notification = inject(NotificationService);

  /**
   * Form builder service for creating reactive forms.
   * @private
   * @type {FormBuilder}
   */
  private fb = inject(FormBuilder);

  /**
   * Activated route for accessing URL query parameters.
   * @private
   * @type {ActivatedRoute}
   */
  private route = inject(ActivatedRoute);

  /**
   * Angular router for navigation.
   * @private
   * @type {Router}
   */
  private router = inject(Router);

  /**
   * Authentication API service for validating reset token.
   * @private
   * @type {AuthApi}
   */
  private authApi = inject(AuthApi);

  /**
   * Authentication service for handling password reset.
   * @public
   * @type {AuthService}
   */
  public auth = inject(AuthService);

  /**
   * Signal containing the password reset token from URL query parameters.
   * @public
   * @type {Signal<string>}
   */
  public token = signal<string>('');

  /**
   * Signal containing the email address associated with the reset token.
   * @public
   * @type {Signal<string>}
   */
  public email = signal<string>('');

  /**
   * Signal controlling password field visibility.
   * @public
   * @type {Signal<boolean>}
   */
  public showPassword = signal<boolean>(false);

  /**
   * Signal controlling confirm password field visibility.
   * @public
   * @type {Signal<boolean>}
   */
  public showConfirmPassword = signal<boolean>(false);

  /**
   * Reactive form for password reset.
   * @public
   * @type {FormGroup}
   */
  resetPasswordForm!: FormGroup;

  /**
   * Lifecycle hook that is called after component initialization.
   * Extracts the reset token from URL parameters, initializes the password reset form
   * with validation rules, and loads token information.
   *
   * @returns {void}
   */
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
   * Loads and validates the reset token information.
   * Retrieves the email associated with the token via AuthApi.
   * Redirects to homepage if token is invalid.
   *
   * @private
   * @returns {Promise<void>}
   */
  private async loadTokenInfo(): Promise<void> {
    try {
      const response = await this.authApi.validateResetToken(this.token());
      if (response.valid && response.email) {
        this.email.set(response.email);
      }
    } catch (error) {
      console.error('Error loading token information:', error);
      this.router.navigate(['/accueil']);
    }
  }




  /**
   * Custom validator to verify that password and confirm password fields match.
   *
   * @private
   * @param {AbstractControl} control - The form group containing password fields
   * @returns {ValidationErrors | null} Returns {passwordMismatch: true} if passwords don't match, null otherwise
   */
  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }




  /**
   * Toggles the visibility of the password field.
   *
   * @public
   * @returns {void}
   */
  public togglePasswordVisibility(): void {
    this.showPassword.update(v => !v);
  }




  /**
   * Toggles the visibility of the confirm password field.
   *
   * @public
   * @returns {void}
   */
  public toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword.update(v => !v);
  }




  /**
   * Handles form submission to reset the user's password.
   * Validates the form, submits the new password via AuthService, and redirects
   * to homepage with a success message.
   *
   * @public
   * @returns {Promise<void>}
   */
  public async handleSubmit(): Promise<void> {
    if (this.resetPasswordForm.invalid || this.auth.isLoading()) return;

    try {
      const credentials = {
        token: this.token(),
        password: this.resetPasswordForm.value.password
      };

      await this.auth.resetPassword(credentials);

      this.notification.show('reinit.success', 2000, true);
    } catch (error) {
      this.notification.show('reinit.error', 2000, true);
      console.error('Error during password reset:', error);
    }
  }
}
