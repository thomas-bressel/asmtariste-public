import { Component, OnDestroy, OnInit, inject, EffectRef, effect, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.html',
  styleUrls: ['./login-modal.scss'],
  imports: [ReactiveFormsModule, RouterLink]
})
export class LoginModal implements OnInit, OnDestroy {

  // Dependency injections
  private fb = inject(FormBuilder);
  public auth = inject(AuthService);
  private router = inject(Router);

  // Modal visibility state
  public isVisible = false;

  // Mode: 'login' ou 'signIn'
  public mode = signal<'login' | 'signIn'>('login');

  // Login form group
  loginForm!: FormGroup;

  // Effect reference for loading state
  private loadingEffectRef?: EffectRef;


  // Build
  constructor() {
    // Effect to disable/enable form controls based on isLoading state
    this.loadingEffectRef = effect(() => {
      if (this.auth.isLoading() && this.loginForm) this.loginForm.disable();
      if (!this.auth.isLoading() && this.loginForm) this.loginForm.enable();
    });
  }





ngOnInit(): void {
    // Initialiser le formulaire
    this.loginForm = this.fb.group({
      nickname: new FormControl('', { validators: [Validators.required], nonNullable: true }),
      password: new FormControl('', { validators: [Validators.required], nonNullable: true }),
      email: new FormControl('', { validators: [Validators.required, Validators.email], nonNullable: true })
    });

    // GÃ©rer la fermeture avec la touche ESC
    document.addEventListener('keydown', this.handleKeyDown);

    // Mettre Ã  jour manuellement l'Ã©tat du formulaire aprÃ¨s son initialisation
    if (this.auth.isLoading()) {
      this.loginForm.disable();
    } else {
      this.loginForm.enable();
    }
  }




/**
 * On component death
 */
  ngOnDestroy(): void {
    // Nettoyer l'effect
    if (this.loadingEffectRef) this.loadingEffectRef.destroy();

    // Supprimer les écouteurs d'événements
    document.removeEventListener('keydown', this.handleKeyDown);

    // Réactiver le scroll si la modale est visible lors de la destruction
    if (this.isVisible) document.body.style.overflow = 'unset';

  }






  /**
   * Ouvrir la modale
   */
  public open(): void {
    this.mode.set('login');
    this.updateFormValidators();
    this.isVisible = true;
    document.body.style.overflow = 'hidden'; // Bloquer le scroll
  }






  /**
   * Ouvrir la modale en mode inscription
   */
  public openSignIn(): void {
    this.mode.set('signIn');
    this.updateFormValidators();
    this.loginForm.reset();
    this.isVisible = true;
    document.body.style.overflow = 'hidden'; // Bloquer le scroll
  }


  /**
   * Basculer entre les modes login et signIn
   */
  public toggleMode(): void {
    this.mode.update(m => m === 'login' ? 'signIn' : 'login');
    this.updateFormValidators();
    this.loginForm.reset();
    this.auth.clearError();
  }








  /**
   * Mettre à jour les validateurs du formulaire selon le mode
   */
  private updateFormValidators(): void {
    if (this.mode() === 'login') {
      this.loginForm.get('email')?.clearValidators();
      this.loginForm.get('password')?.setValidators([Validators.required]);
    } else {
      this.loginForm.get('email')?.setValidators([Validators.required, Validators.email]);
      this.loginForm.get('password')?.clearValidators();
    }
    this.loginForm.get('email')?.updateValueAndValidity();
    this.loginForm.get('password')?.updateValueAndValidity();
  }





  /**
   * Fermer la modale
   */
  public close(): void {
    this.loginForm.reset();
    this.auth.clearError();
    this.isVisible = false;
    document.body.style.overflow = 'unset'; // Réactiver le scroll

    // // Reload the homepage to update the content based on authentication state
    // this.router.navigateByUrl('/accueil', { replaceUrl: true }).then(() => {
    //   location.reload();
    // });
  }






  /**
   * Gestionnaire d'événement pour la touche ESC
   */
  private handleKeyDown = (e: KeyboardEvent): void => {
    if (e.key === 'Escape' && this.isVisible) this.close();
  }






  /**
   * Gestion du clic sur l'overlay (fermeture de la modale)
   */
  handleOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.close();
  }





/**
   * Soumission du formulaire de connexion
   */
  async handleSubmit(): Promise<void> {
    if (this.loginForm.invalid || this.auth.isLoading()) return;

    try {
      if (this.mode() === 'login') {
        const credentials = { 
          nickname: this.loginForm.value.nickname,
          password: this.loginForm.value.password
        };
        await this.auth.login(credentials);
        console.log('Utilisateur connecté');
        this.isVisible = false;
        document.body.style.overflow = 'unset';
        
        // Recharger uniquement après connexion réussie
        this.router.navigateByUrl('/accueil', { replaceUrl: true }).then(() => {
          // location.reload();
        });
      } else {
        const credentials = { 
          nickname: this.loginForm.value.nickname,
          email: this.loginForm.value.email
        };
        await this.auth.signIn(credentials);
        console.log('Inscription réussie');
        
        // Fermer la modale et afficher un message de succès
        this.isVisible = false;
        document.body.style.overflow = 'unset';
        
        // Message de succès
        alert('✓ Un email de confirmation vous a été envoyé. Consultez votre boîte mail pour finaliser votre inscription.');
        
        this.loginForm.reset();
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  }





  /**
   * Connexion avec Google
   */
  async handleGoogleLogin(): Promise<void> {
    if (this.auth.isLoading()) return;

    try {
      const authUrl = await this.auth.loginWithGoogle();
      // Rediriger vers l'URL d'authentification Google
      window.location.href = authUrl;
    } catch (error) {
      console.error('Erreur Google OAuth:', error);
    }
  }
}