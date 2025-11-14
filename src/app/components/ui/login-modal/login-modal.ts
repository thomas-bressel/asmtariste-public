import { Component, OnDestroy, OnInit, inject, EffectRef, effect } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.html',
  styleUrls: ['./login-modal.scss'],
  imports: [ReactiveFormsModule, RouterLink]
})
export class LoginModal implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  public auth = inject(AuthService);
  
  // Modal visibility state
  public isVisible = false;
  
  // Login form group
  loginForm!: FormGroup;

  // Effect reference for loading state
  private loadingEffectRef?: EffectRef;
  
  constructor() {

    // Effect to disable/enable form controls based on isLoading state
    this.loadingEffectRef = effect(() => {
        if (this.auth.isLoading() && this.loginForm) this.loginForm.disable();
        if (!this.auth.isLoading() && this.loginForm)  this.loginForm.enable();
    });
  }
  




  
  ngOnInit(): void {
    // Initialiser le formulaire
    this.loginForm = this.fb.group({
      nickname: new FormControl('', { validators: [Validators.required], nonNullable: true }),
      password: new FormControl('', { validators: [Validators.required], nonNullable: true })
    });
    
    // Gérer la fermeture avec la touche ESC
    document.addEventListener('keydown', this.handleKeyDown);
    
    // Mettre à jour manuellement l'état du formulaire après son initialisation
    if (this.auth.isLoading()) {
       this.loginForm.disable();
    } else {
      this.loginForm.enable();
    }
  }
  




  
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
    this.isVisible = true;
    document.body.style.overflow = 'hidden'; // Bloquer le scroll
  }
  




  
  /**
   * Fermer la modale
   */
  public close(): void {
    this.loginForm.reset();
    this.auth.clearError();
    this.isVisible = false;
    document.body.style.overflow = 'unset'; // Réactiver le scroll
  }
  




  
  /**
   * Gestionnaire d'événement pour la touche ESC
   */
  private handleKeyDown = (e: KeyboardEvent): void => {
    if (e.key === 'Escape' && this.isVisible)  this.close();
  }
  





  /**
   * Gestion du clic sur l'overlay (fermeture de la modale)
   */
  handleOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget)  this.close();
  }
  





  /**
   * Soumission du formulaire de connexion
   */
  async handleSubmit(): Promise<void> {
    if (this.loginForm.invalid || this.auth.isLoading())  return;
    
    try {
      const credentials = this.loginForm.value;
      const userDatas = await this.auth.login(credentials);
      console.log('Utilisateur connecté:', userDatas);
      this.close();
    } catch (error) {
      console.error('Erreur de connexion:', error);
    }
  }
  





  /**
   * Connexion avec Google
   */
  async handleGoogleLogin(): Promise<void> {
    if (this.auth.isLoading())  return;
    
    try {
      const authUrl = await this.auth.loginWithGoogle();
      // Rediriger vers l'URL d'authentification Google
      window.location.href = authUrl;
    } catch (error) {
      console.error('Erreur Google OAuth:', error);
    }
  }
}