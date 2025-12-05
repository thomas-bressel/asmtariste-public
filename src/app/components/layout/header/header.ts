// Angular imports
import { Component, ViewChild, signal, inject, computed, OnInit, OnDestroy, effect } from '@angular/core';
import { RouterLink, Router, NavigationEnd } from "@angular/router";
import { filter } from 'rxjs/operators';

// Service imports
import { AuthService } from '@services/auth.service';
import { Notification, NotificationService } from '@services/ui/notification.service';

// Component imports
import { LoginModal } from '@components/ui/login-modal/login-modal';
import { USER_API_URI } from 'src/app/shared/config-api';
import { NotExpr } from '@angular/compiler';

/**
 * Angular standalone header component for application navigation and authentication.
 *
 * This component provides the main application header with navigation menu, user authentication controls,
 * scroll progress indicator, and responsive mobile menu. It integrates with the AuthService to manage
 * user authentication state and displays user information when logged in.
 *
 * Features:
 * - Responsive mobile menu toggle
 * - Scroll progress indicator showing page scroll position
 * - Quick navigation display on homepage
 * - User authentication state display (login/logout)
 * - User avatar and full name display when authenticated
 * - Integration with LoginModal for authentication flows
 * - Dynamic route-based behavior
 */
@Component({
  selector: 'header[app-header]',
  imports: [RouterLink, LoginModal],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  host: {
    'class': 'header'
  }
})
export class Header implements OnInit, OnDestroy {
  /** ViewChild reference to the login modal component for programmatic control */
  @ViewChild(LoginModal) loginModal!: LoginModal;

  /** Base URL for user avatar images from API configuration */
  private readonly avatarBaseUrl = USER_API_URI;

  /** Injected AuthService for managing authentication state */
  public auth = inject(AuthService);

  /** Injected Router for navigation and route monitoring */
  private router = inject(Router);

  private notifications = inject(NotificationService)

  /** Signal controlling the mobile menu open/closed state */
  public isOpen = signal<boolean>(false);

  /** Signal tracking the page scroll progress as a percentage (0-100) */
  public scrollProgress = signal<number>(0);

  /** Signal controlling the visibility of quick navigation on homepage */
  public showQuickNav = signal<boolean>(false);

  /**
   * Computed signal that generates the user's avatar URL.
   * Returns the user's custom avatar if available, otherwise returns default avatar.
   * Constructs full URL from base API URL and avatar filename.
   *
   * @returns Full URL to user avatar image or default avatar
   */
  public readonly avatarUrl = computed(() => {
    const user = this.auth.user()?.user;
    return user?.avatar ? `${this.avatarBaseUrl}/avatars/${user.avatar}` : this.avatarBaseUrl + '/default-avatar.png';
  });

  /**
   * Computed signal that generates the user's full name.
   * Combines first name and last name from authenticated user data.
   *
   * @returns User's full name as "firstname lastname", or empty string if not authenticated
   */
  public readonly userFullName = computed(() => {
    const user = this.auth.user()?.user;
    return user ? `${user.firstname} ${user.lastname}` : '';
  });



  /**
   * Constructor that initializes the component with reactive effects.
   * Sets up an effect to monitor route changes and control quick navigation visibility.
   * Quick navigation is shown only on the homepage ('/accueil').
   */
  constructor() {
    effect(() => {
      if (this.router.url === '/accueil') {
        this.showQuickNav.set(true);
      } else {
        this.showQuickNav.set(false);
      }
    });
  }

  /**
   * Angular lifecycle hook called after component initialization.
   * Initializes scroll progress tracking, sets up scroll event listener,
   * and subscribes to router navigation events to update quick navigation visibility.
   */
  ngOnInit(): void {
    this.updateScrollProgress();
    window.addEventListener('scroll', this.updateScrollProgress);

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.showQuickNav.set(this.router.url === '/accueil');
      });
  }




  /**
   * Angular lifecycle hook called before component destruction.
   * Removes the scroll event listener to prevent memory leaks.
   */
  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.updateScrollProgress);
  }







  /**
   * Calculates and updates the scroll progress indicator.
   * Computes the scroll position as a percentage of total scrollable height.
   * The progress value ranges from 0 to 100, where:
   * - 0 represents top of page
   * - 100 represents bottom of page
   * If page is not scrollable, sets progress to 0.
   *
   * @private
   */
  private updateScrollProgress = (): void => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY;
    const scrollableHeight = documentHeight - windowHeight;

    if (scrollableHeight > 0) {
      const progress = (scrollTop / scrollableHeight) * 100;
      this.scrollProgress.set(Math.min(progress, 100));
    } else {
      this.scrollProgress.set(0);
    }
  }






  /**
   * Toggles the mobile navigation menu between open and closed states.
   * Inverts the current value of the isOpen signal.
   */
  public toggleMenu(): void {
    this.isOpen.set(!this.isOpen());
  }

  /**
   * Opens the login modal in login mode.
   * Prevents default event behavior if event is provided,
   * opens the modal, and closes the mobile menu.
   *
   * @param event - Optional event object to prevent default behavior
   *
   */
  public openLoginModal(event?: Event): void {
    if (event) event.preventDefault();
    if (this.loginModal) this.loginModal.open();
    this.isOpen.set(false);
  }





  /**
   * Opens the login modal in registration (sign-in) mode.
   * Prevents default event behavior if event is provided,
   * opens the modal in sign-in mode, and closes the mobile menu.
   *
   * @param event - Optional event object to prevent default behavior
   */
  public openSignInModal(event?: Event): void {
    if (event) event.preventDefault();
    if (this.loginModal) this.loginModal.openSignIn();
    this.isOpen.set(false);
  }







  /**
   * Handles user logout process.
   * Prevents default event behavior if event is provided,
   * calls the authentication service to log out the user,
   * navigates to the homepage, reloads the page to clear state,
   * and closes the mobile menu.
   *
   * @param event - Optional event object to prevent default behavior
   * @returns Promise that resolves when logout completes
   *
   */
  public async handleLogout(event?: Event): Promise<void> {
    if (event) event.preventDefault();

    try {
      await this.auth.logout();
      this.isOpen.set(false);
      this.notifications.show('logout.success', 2000, true)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error during logout';
      console.error('Error during logout:', errorMessage);
    }
  }
}