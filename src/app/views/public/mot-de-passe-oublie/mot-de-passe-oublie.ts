import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth.service';

/**
 * Forgot password page component for the public area.
 * Route: /mot-de-passe-oublie
 *
 * @component
 * @description Allows users to request a password reset by providing their email address.
 * Sends a password reset email via AuthService and displays confirmation when successful.
 */
@Component({
  selector: 'app-mot-de-passe-oublie',
  templateUrl: './mot-de-passe-oublie.html',
  styleUrls: ['./mot-de-passe-oublie.scss'],
  imports: [ReactiveFormsModule]
})
export class MotDePasseOublie {
  /**
   * Form builder service for creating reactive forms.
   * @private
   * @type {FormBuilder}
   */
  private fb = inject(FormBuilder);

  /**
   * Angular router for navigation.
   * @private
   * @type {Router}
   */
  private router = inject(Router);

  /**
   * Authentication service for handling password reset requests.
   * @public
   * @type {AuthService}
   */
  public auth = inject(AuthService);

  /**
   * Signal indicating whether the reset email has been sent successfully.
   * @public
   * @type {Signal<boolean>}
   */
  public emailSent = signal<boolean>(false);

  /**
   * Signal indicating whether the form is currently being submitted.
   * @public
   * @type {Signal<boolean>}
   */
  public isSubmitting = signal<boolean>(false);

  /**
   * Reactive form for the forgot password request.
   * @public
   * @type {FormGroup}
   */
  forgotPasswordForm!: FormGroup;

  /**
   * Lifecycle hook that is called after component initialization.
   * Initializes the forgot password form with email validation.
   *
   * @returns {void}
   */
  ngOnInit(): void {
    this.forgotPasswordForm = this.fb.nonNullable.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  /**
   * Handles form submission to request a password reset.
   * Validates the form, sends the reset request via AuthService, and displays confirmation.
   *
   * @returns {Promise<void>}
   */
  public async handleSubmit(): Promise<void> {
    if (this.forgotPasswordForm.invalid || this.isSubmitting()) return;

    this.isSubmitting.set(true);
    this.auth.clearError();

    try {
      await this.auth.forgotPassword(this.forgotPasswordForm.value.email);
      this.emailSent.set(true);
    } catch (error) {
      console.error('Error during password reset request:', error);
    } finally {
      this.isSubmitting.set(false);
    }
  }

  /**
   * Navigates back to the homepage.
   *
   * @returns {void}
   */
  public goHome(): void {
    this.router.navigate(['/accueil']);
  }
}
