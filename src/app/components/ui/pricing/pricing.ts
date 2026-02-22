import { Component, signal, computed } from '@angular/core';

/**
 * Pricing section component that displays subscription plans.
 *
 * This is an Angular standalone component that renders pricing tiers
 * with feature comparisons and a funding progress indicator. It displays
 * three subscription levels with their features and pricing information.
 *
 * @component
 * @standalone
 * @selector section[app-pricing]
 * @example
 * <section app-pricing></section>
 */
@Component({
  selector: 'section[app-pricing]',
  imports: [],
  templateUrl: './pricing.html',
  styleUrls: ['./pricing.scss', './progress-bar.scss'],
  host: {
    'class': 'pricing'
  }
})
export class Pricing {

  /**
   * Signal containing the current funding amount in euros.
   * @protected
   */
  protected currentAmount = signal(11.88 * 3);

  /**
   * Signal containing the target funding amount in euros.
   * @protected
   */
  protected targetAmount = signal(122.26);

  /**
   * Computed signal calculating the funding progress percentage.
   * Returns a value between 0 and 100.
   * @protected
   * @readonly
   */
  protected progressPercentage = computed(() =>
    Math.min(Math.round((this.currentAmount() / this.targetAmount()) * 100), 100)
  );

  /**
   * Array of subscription plan objects with pricing and features.
   *
   * Contains three tiers:
   * - Free tier: Basic access to courses and documentation
   * - Freemium tier (11.88€/year): Includes additional resources
   * - Premium tier (23.88€/year): Full access to all features
   *
   * @public
   */
  public plans = [
    {
      name: 'Radin !',
      price: 'Gratuit',
      period: '',
      monthlyPrice: null,
      ctaText: '',
      features: [
        { text: 'Tous les Cours ASM 68000', available: true },
        { text: 'Toutes les documentations Atari', available: true },
        { text: 'Tutoriel', available: true },
        { text: 'Ressources à télécharger', available: true },
        { text: 'Sources commenté .ASM', available: true },
        { text: 'Planches de sprites/masques .IFF', available: false },
        { text: 'Screen .PI1', available: false },
        { text: 'Musique midi/cubase .MID, .SND', available: false },
        { text: 'Samples audio .RAW, .AVR', available: false },
        { text: 'Accès libre aux projets complets', available: false },
        { text: 'Archiver les articles en PDF', available: false },
      ],
      highlighted: false
    },
    {
      name: 'Merci beaucoup !',
      price: '11.88€',
      period: '/an',
      monthlyPrice: '0.99€',
      ctaText: 'Soutenir le projet',
      features: [
        { text: 'Tous les Cours ASM 68000', available: true },
        { text: 'Toutes les documentations Atari', available: true },
        { text: 'Tutoriel', available: true },
        { text: 'Ressources à télécharger', available: true },
        { text: 'Sources commenté .ASM', available: true },
        { text: 'Planches de sprites/masques .IFF', available: true },
        { text: 'Screen .PI1', available: true },
        { text: 'Musique midi/cubase .MID, .SND', available: true },
        { text: 'Samples audio .RAW, .AVR', available: true },
        { text: 'Accès libre aux projets complets', available: false },
        { text: 'Archiver les articles en PDF', available: false },
      ],
      highlighted: true
    },
    {
      name: 'Ô grand philanthrope !',
      price: '23.88€',
      period: '/an',
      monthlyPrice: '1.99€',
      ctaText: '',
      features: [
        { text: 'Tous les Cours ASM 68000', available: true },
        { text: 'Toutes les documentations Atari', available: true },
        { text: 'Tutoriel', available: true },
        { text: 'Ressources à télécharger', available: true },
        { text: 'Sources commenté .ASM', available: true },
        { text: 'Planches de sprites/masques .IFF', available: true },
        { text: 'Screen .PI1', available: true },
        { text: 'Musique midi/cubase .MID, .SND', available: true },
        { text: 'Samples audio .RAW, .AVR', available: true },
        { text: 'Accès libre aux projets complets', available: true },
        { text: 'Archiver les articles en PDF', available: true },
      ],
      highlighted: false
    }
  ];
}