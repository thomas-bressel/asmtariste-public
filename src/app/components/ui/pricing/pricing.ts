import { Component, signal, computed } from '@angular/core';

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

   protected currentAmount = signal(0);
  protected targetAmount = signal(192);
  protected progressPercentage = computed(() => 
    Math.min(Math.round((this.currentAmount() / this.targetAmount()) * 100), 100)
  );


  public plans = [
    {
      name: 'Radin !',
      price: 'Gratuit',
      period: '',
      monthlyPrice: null,
      ctaText: '',
      features: [
        { text: 'Tous les Cours ASM 68000', available: true },
        { text: 'Toutes les documentation Atari', available: true },
        { text: 'tutoriel', available: true },
        { text: 'Ressources à télécharger', available: true },
        { text: 'Sources commenté .ASM', available: true },
        { text: 'Planches de sprites/masques .IFF', available: false },
        { text: 'Screen .PI1', available: false },
        { text: 'Samples audio .SND', available: false },
        { text: 'Musique midi/cubase .SND', available: false },
        { text: 'Accès libre aux projets complets', available: false }
        
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
        { text: 'Toutes les documentation Atari', available: true },
        { text: 'tutoriel', available: true },
        { text: 'Ressources à télécharger', available: true },
        { text: 'Sources commenté .ASM', available: true },
        { text: 'Planches de sprites/masques .IFF', available: true },
        { text: 'Screen .PI1', available: true },
        { text: 'Musique midi/cubase .SND', available: true },
        { text: 'Samples audio .SND', available: true },
        { text: 'Accès libre aux projets complets', available: false }
        
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
        { text: 'Toutes les documentation Atari', available: true },
        { text: 'tutoriel', available: true },
        { text: 'Ressources à télécharger', available: true },
        { text: 'Sources commenté .ASM', available: true },
        { text: 'Planches de sprites/masques .IFF', available: true },
        { text: 'Musique midi/cubase .SND', available: true },
        { text: 'Samples audio .SND', available: true },
        { text: 'Accès libre aux projets complets', available: true }
      ],
      highlighted: false
    }
  ];
}