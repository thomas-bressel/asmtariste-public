import { Component, OnInit, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// Service imports
import { AuthService } from '@services/auth.service';
import { AuthApi } from '@services/api/auth-api.service';
import { NotificationService } from '@services/ui/notification.service';

/**
 * Account setup password page component for new user registration completion.
 * Route: /setup-password (requires valid signup token)
 *
 * @component
 * @description Allows new users to complete their account setup by creating a password.
 * Validates the signup token via AuthApi, displays the user's nickname and email,
 * and handles the password setup with validation and confirmation matching.
 */
@Component({
  selector: 'app-setup-password',
  templateUrl: './setup-password.html',
  styleUrls: ['./setup-password.scss'],
  imports: [ReactiveFormsModule]
})
export class SetupPassword implements OnInit {
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
   * Authentication API service for validating signup token.
   * @private
   * @type {AuthApi}
   */
  private authApi = inject(AuthApi);

  /**
   * Authentication service for handling signup confirmation.
   * @public
   * @type {AuthService}
   */
  public auth = inject(AuthService);

  /**
   * Signal containing the signup token from URL query parameters.
   * @public
   * @type {Signal<string>}
   */
  public token = signal<string>('');

  /**
   * Signal containing the user's nickname from the signup token.
   * @public
   * @type {Signal<string>}
   */
  public nickname = signal<string>('');

  /**
   * Signal containing the user's email from the signup token.
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
   * Reactive form for password setup.
   * @public
   * @type {FormGroup}
   */
  signupForm!: FormGroup;

  /**
   * Lifecycle hook that is called after component initialization.
   * Extracts the signup token from URL parameters, initializes the password setup form
   * with validation rules, and loads token information.
   *
   * @returns {void}
   */
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
   * Loads and validates the signup token information.
   * Retrieves the nickname and email associated with the token via AuthApi.
   *
   * @private
   * @returns {Promise<void>}
   */
  private async loadTokenInfo(): Promise<void> {
    try {
      const response = await this.authApi.validateSignupToken(this.token());
      if (response.valid && response.nickname && response.email) {
        this.nickname.set(response.nickname);
        this.email.set(response.email);
      }
    } catch (error) {
      console.error('Error loading token information:', error);
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
   * Handles form submission to complete the signup process.
   * Validates the form, submits the password via AuthService, and redirects
   * to homepage with a success message.
   *
   * @public
   * @returns {Promise<void>}
   */
  public async handleSubmit(): Promise<void> {
    if (this.signupForm.invalid || this.auth.isLoading()) return;

    try {
      const credentials = {
        token: this.token(),
        password: this.signupForm.value.password
      };

      await this.auth.confirmSignup(credentials);

      this.notification.show('confirm.success', 3000, true)
      
    } catch (error) {
      console.error('Error during signup completion:', error);
      this.notification.show('confirm.error', 3000, true)
    }
  }
}