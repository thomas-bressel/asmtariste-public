// Angular imports
import { Component, ViewChild, signal, inject, computed, OnInit, OnDestroy, effect } from '@angular/core';
import { RouterLink, Router, NavigationEnd } from "@angular/router";
import { filter } from 'rxjs/operators';

// Service imports
import { AuthService } from '@services/auth.service';

// Component imports
import { LoginModal } from '@components/ui/login-modal/login-modal';

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
  @ViewChild(LoginModal) loginModal!: LoginModal;
  private readonly avatarBaseUrl = 'http://localhost:5002/avatars/';

  // Dependency injections
  public auth = inject(AuthService);
  private router = inject(Router);


  // Signal properties
  public isOpen = signal<boolean>(false);
  public scrollProgress = signal<number>(0);
  public showQuickNav = signal<boolean>(false);


  // Computed properties
  public readonly avatarUrl = computed(() => {
    const user = this.auth.user()?.user;
    return user?.avatar ? `${this.avatarBaseUrl}${user.avatar}` : this.avatarBaseUrl + '/default-avatar.png';
  });

  public readonly userFullName = computed(() => {
    const user = this.auth.user()?.user;
    return user ? `${user.firstname} ${user.lastname}` : '';
  });



  // Build
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
   * On component initialisation
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
   * On component destruction
   */
  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.updateScrollProgress);
  }






  /**
   * 
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
   * 
   */
  public toggleMenu(): void {
    this.isOpen.set(!this.isOpen());
  }






  /**
   * Open the login modal when the user click on SignUp button
   * @param event 
   */
  public openLoginModal(event?: Event): void {
    if (event) event.preventDefault();
    if (this.loginModal) this.loginModal.open();
    this.isOpen.set(false);
  }





    /**
   * Open the register modal when the user click on SignIn button
   * @param event 
   */
  public openSignInModal(event?: Event): void {
    if (event) event.preventDefault();
    if (this.loginModal) this.loginModal.openSignIn();
    this.isOpen.set(false);
  }







  /**
   * 
   * @param event 
   */
  public async handleLogout(event?: Event): Promise<void> {
    if (event) event.preventDefault();

    try {
      await this.auth.logout();
      this.router.navigateByUrl('/accueil', { replaceUrl: true }).then(() => {
        location.reload();
      });
      this.isOpen.set(false);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  }
}