import { Component, OnDestroy, OnInit, inject, EffectRef, effect, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { NotificationService } from '@services/ui/notification.service';

/**
 * Angular standalone modal component for user authentication.
 *
 * This component provides a dual-purpose modal dialog for both login and registration (sign-in) functionality.
 * It features reactive forms with dynamic validation, OAuth integration with Google, keyboard navigation support,
 * and automatic form state management based on loading states.
 *
 * Features:
 * - Toggle between login and registration modes
 * - Form validation with email and required field validators
 * - Google OAuth authentication support
 * - ESC key to close modal
 * - Click outside overlay to close
 * - Auto-focus on first input field
 * - Loading state management with automatic form disable/enable
 * - Mobile-friendly overflow handling
 *
 * @example
 * ```typescript
 * // In parent component template
 * <app-login-modal #loginModal></app-login-modal>
 *
 * // In parent component class
 * @ViewChild('loginModal') loginModal!: LoginModal;
 *
 * openLogin() {
 *   this.loginModal.open();
 * }
 * ```
 */
@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.html',
  styleUrls: ['./login-modal.scss'],
  imports: [ReactiveFormsModule, RouterLink]
})
export class LoginModal implements OnInit, OnDestroy {

  /** Injected FormBuilder for reactive form creation */
  private fb = inject(FormBuilder);

  /** Injected AuthService for authentication operations */
  public auth = inject(AuthService);

  /** Injected Router for navigation after authentication */
  private router = inject(Router);

  /** Injected NotificationService for displaying user messages */
  private notificationService = inject(NotificationService);

  /** Boolean flag controlling the modal's visibility state */
  public isVisible = false;

  /**
   * Signal controlling the modal mode.
   * 'login' - Shows login form with nickname and password
   * 'signIn' - Shows registration form with nickname and email
   */
  public mode = signal<'login' | 'signIn'>('login');

  /** Reactive form group containing authentication form controls */
  loginForm!: FormGroup;

  /**
   * Reference to the effect that synchronizes form state with loading status.
   * Stored to allow proper cleanup on component destruction.
   */
  private loadingEffectRef?: EffectRef;

  /**
   * Constructor that initializes the component and sets up reactive effects.
   * Creates an effect that automatically disables the form during authentication requests
   * and re-enables it when complete.
   */
  constructor() {
    // Effect to disable/enable form controls based on isLoading state
    this.loadingEffectRef = effect(() => {
      if (this.auth.isLoading() && this.loginForm) this.loginForm.disable();
      if (!this.auth.isLoading() && this.loginForm) this.loginForm.enable();
    });
  }





  /**
   * Angular lifecycle hook called after component initialization.
   * Initializes the reactive form with all necessary controls and validators,
   * sets up keyboard event listeners for ESC key handling,
   * and synchronizes initial form state with authentication loading status.
   */
  ngOnInit(): void {
    // Initialize the form with all controls
    this.loginForm = this.fb.group({
      nickname: new FormControl('', { validators: [Validators.required], nonNullable: true }),
      password: new FormControl('', { validators: [Validators.required], nonNullable: true }),
      email: new FormControl('', { validators: [Validators.required, Validators.email], nonNullable: true }),
      acceptCgu: new FormControl(false, { nonNullable: true }),
      acceptPrivacy: new FormControl(false, { nonNullable: true })
    });

    // Handle modal closure with ESC key
    document.addEventListener('keydown', this.handleKeyDown);

    // Manually update form state after initialization
    this.auth.isLoading() ? this.loginForm.disable() : this.loginForm.enable();
  }




  /**
   * Angular lifecycle hook called before component destruction.
   * Performs cleanup operations including destroying the loading effect,
   * removing keyboard event listeners, and restoring page scrolling if modal is visible.
   */
  ngOnDestroy(): void {
    // Clean up the loading effect
    if (this.loadingEffectRef) this.loadingEffectRef.destroy();

    // Remove event listeners
    document.removeEventListener('keydown', this.handleKeyDown);

    // Re-enable scrolling if modal is visible during destruction
    if (this.isVisible) document.body.style.overflow = 'unset';
  }






  /**
   * Opens the modal in login mode.
   * Updates form validators for login requirements (nickname and password),
   * disables page scrolling on desktop devices, and auto-focuses the first input field.
   * On mobile devices (width < 768px), scrolling is preserved to allow keyboard functionality.
   */
  public open(): void {
    this.mode.set('login');
    this.updateFormValidators();
    this.isVisible = true;

    // On mobile, don't block overflow to allow keyboard to function properly
    if (window.innerWidth >= 768) document.body.style.overflow = 'hidden';

    // Auto-focus on the first field after opening
    setTimeout(() => {
      const firstInput = document.getElementById('nickname');
      if (firstInput) firstInput.focus();
    }, 100);
  }






  /**
   * Opens the modal in registration (sign-in) mode.
   * Updates form validators for registration requirements (nickname and email),
   * resets the form to clear any previous data, disables page scrolling on desktop devices,
   * and auto-focuses the first input field.
   * On mobile devices (width < 768px), scrolling is preserved to allow keyboard functionality.
   */
  public openSignIn(): void {
    this.mode.set('signIn');
    this.updateFormValidators();
    this.loginForm.reset();
    this.isVisible = true;

    // On mobile, don't block overflow to allow keyboard to function properly
    if (window.innerWidth >= 768) document.body.style.overflow = 'hidden';

    // Auto-focus on the first field after opening
    setTimeout(() => {
      const firstInput = document.getElementById('nickname');
      if (firstInput) firstInput.focus();
    }, 100);
  }







  /**
   * Toggles between login and registration (sign-in) modes.
   * Updates form validators according to the new mode, resets the form,
   * and clears any authentication errors from previous attempts.
   */
  public toggleMode(): void {
    this.mode.update(m => m === 'login' ? 'signIn' : 'login');
    this.updateFormValidators();
    this.loginForm.reset();
    this.auth.clearError();
  }








  /**
   * Updates form validators dynamically based on the current modal mode.
   * In login mode: email is not required, password is required
   * In sign-in mode: email is required with email format validation, password is not required
   * Triggers validation updates for affected form controls.
   *
   * @private
   */
  private updateFormValidators(): void {
    if (this.mode() === 'login') {
      this.loginForm.get('email')?.clearValidators();
      this.loginForm.get('password')?.setValidators([Validators.required]);
      this.loginForm.get('acceptCgu')?.clearValidators();
      this.loginForm.get('acceptPrivacy')?.clearValidators();
    } else {
      this.loginForm.get('email')?.setValidators([Validators.required, Validators.email]);
      this.loginForm.get('password')?.clearValidators();
      this.loginForm.get('acceptCgu')?.setValidators([Validators.requiredTrue]);
      this.loginForm.get('acceptPrivacy')?.setValidators([Validators.requiredTrue]);
    }
    this.loginForm.get('email')?.updateValueAndValidity();
    this.loginForm.get('password')?.updateValueAndValidity();
    this.loginForm.get('acceptCgu')?.updateValueAndValidity();
    this.loginForm.get('acceptPrivacy')?.updateValueAndValidity();
  }





  /**
   * Closes the modal dialog.
   * Resets the form to clear all entered data, clears any authentication errors,
   * hides the modal, and re-enables page scrolling.
   */
  public close(): void {
    this.loginForm.reset();
    this.auth.clearError();
    this.isVisible = false;
    document.body.style.overflow = 'unset'; // Re-enable scrolling

  }






  /**
   * Event handler for keyboard events.
   * Closes the modal when ESC key is pressed and modal is visible.
   *
   * @param e - Keyboard event object
   * @private
   */
  private handleKeyDown = (e: KeyboardEvent): void => {
    if (e.key === 'Escape' && this.isVisible) this.close();
  }








  /**
   * Handles clicks on the modal overlay (backdrop).
   * Closes the modal only when clicking directly on the overlay,
   * not when clicking on modal content.
   *
   * @param event - Mouse event object
   */
  handleOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.close();
  }





  /**
   * Handles form submission for both login and registration.
   * Validates form state before processing. In login mode, authenticates user with nickname and password.
   * In registration mode, creates new account with nickname and email, then shows confirmation message.
   * Closes modal and navigates appropriately on success.
   *
   * @returns Promise that resolves when authentication completes
   */
  public async handleSubmit(): Promise<void> {
    if (this.loginForm.invalid || this.auth.isLoading()) return;

    try {
      if (this.mode() === 'login') {
        const credentials = {
          nickname: this.loginForm.value.nickname,
          password: this.loginForm.value.password
        };
        await this.auth.login(credentials);
        this.isVisible = false;
        document.body.style.overflow = 'unset';
                
        // Success message
        this.notificationService.show('login.success', 2000, true);

      } else {
        const credentials = {
          nickname: this.loginForm.value.nickname,
          email: this.loginForm.value.email
        };
        await this.auth.signIn(credentials);
        
        // Close modal and display success message
        this.isVisible = false;
        document.body.style.overflow = 'unset';

        this.loginForm.reset();

         // Success message
        this.notificationService.show('registration.success', 5000, false);

      }
    } catch (error) {
      console.error('Error:', error);
    } 
  }


}