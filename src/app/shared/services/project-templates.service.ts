import { Injectable, signal } from '@angular/core';
import { ProjectTemplate, UserProject, UserPhaseState, UserTaskState } from '@models/project.model';

@Injectable({ providedIn: 'root' })
export class ProjectTemplatesService {

  readonly templates = signal<ProjectTemplate[]>([
    {
      slug: 'space-invaders',
      title: 'Space Invaders-like',
      reference: 'Space Invaders (Taito, 1978)',
      difficulty: 'beginner',
      difficultyLabel: 'Débutant',
      image: '/images/projects/spaceinvaders.webp',
      description: 'Le point d\'entrée idéal. Toutes les briques sont simples, isolées et directement réutilisables dans les projets suivants. Grille d\'aliens, tirs, collisions, sons — tout y est sans complexité excessive.',
      skills: [
        { label: 'VBL & timing' },
        { label: 'Affichage de sprites' },
        { label: 'Lecture joystick' },
        { label: 'Collisions basiques' },
        { label: 'Son YM2149' },
      ],
      phases: [
        {
          id: 'phase-pilote',
          title: 'Phase Pilote — Environnement & premier affichage',
          deliverableLabel: 'Screenshot d\'un carré blanc affiché à l\'écran sans clignoter',
          tasks: [
            { id: 'p0-t1', label: 'Hatari configuré et lancé' },
            { id: 'p0-t2', label: 'Assembleur fonctionnel (vasm ou Devpac)' },
            { id: 'p0-t3', label: 'Script de build + lancement automatique' },
            { id: 'p0-t4', label: 'Passer en mode basse résolution (320×200, 16 couleurs)' },
            { id: 'p0-t5', label: 'Définir la palette de couleurs' },
            { id: 'p0-t6', label: 'Afficher un carré blanc à position fixe' },
            { id: 'p0-t7', label: 'Réserver deux zones mémoire écran (double buffering)' },
            { id: 'p0-t8', label: 'Installer le handler VBL (50 Hz)' },
            { id: 'p0-t9', label: 'Écrire la boucle principale synchronisée VBL' },
            { id: 'p0-t10', label: 'Valider : le carré s\'affiche sans clignoter' },
          ]
        },
        {
          id: 'phase-0',
          title: 'Phase 0 — Initialisation',
          deliverableLabel: 'La machine à états minimale tourne : titre → jeu → game over',
          tasks: [
            { id: 'ph0-t1', label: 'Déclarer X_actuel et X_ancien' },
            { id: 'ph0-t2', label: 'Fixer les bornes gauche (0) et droite (319)' },
            { id: 'ph0-t3', label: 'Déclarer l\'état ETAT_TITRE' },
            { id: 'ph0-t4', label: 'Déclarer l\'état ETAT_READY' },
            { id: 'ph0-t5', label: 'Déclarer l\'état ETAT_JOUER' },
            { id: 'ph0-t6', label: 'Déclarer l\'état ETAT_MORT' },
            { id: 'ph0-t7', label: 'Déclarer l\'état ETAT_GAME_OVER' },
            { id: 'ph0-t8', label: 'Déclarer l\'état ETAT_NIVEAU_SUIVANT' },
            { id: 'ph0-t9', label: 'Créer l\'aiguilleur (switch sur JEU_ETAT)' },
          ]
        },
        {
          id: 'phase-1',
          title: 'Phase 1 — Sprites & rendu',
          deliverableLabel: 'Screenshot de tous les sprites affichés à l\'écran avec les bonnes couleurs',
          tasks: [
            { id: 'ph1-t1', label: 'Comprendre le format 4 bitplanes entrelacés ST' },
            { id: 'ph1-t2', label: 'Routine d\'affichage de sprite aligné sur 16px' },
            { id: 'ph1-t3', label: 'Canon joueur (13×8 px)' },
            { id: 'ph1-t4', label: 'Explosion joueur (16×8 px)' },
            { id: 'ph1-t5', label: 'Octopus frame A (12×8 px)' },
            { id: 'ph1-t6', label: 'Octopus frame B (12×8 px)' },
            { id: 'ph1-t7', label: 'Crab frame A (11×8 px)' },
            { id: 'ph1-t8', label: 'Crab frame B (11×8 px)' },
            { id: 'ph1-t9', label: 'Squid frame A (8×8 px)' },
            { id: 'ph1-t10', label: 'Squid frame B (8×8 px)' },
            { id: 'ph1-t11', label: 'Explosion alien (16×8 px)' },
            { id: 'ph1-t12', label: 'UFO (16×7 px)' },
            { id: 'ph1-t13', label: 'Explosion UFO (16×8 px)' },
            { id: 'ph1-t14', label: 'Tir joueur (1×8 px)' },
            { id: 'ph1-t15', label: 'Tir alien Rolling (1×7 px)' },
            { id: 'ph1-t16', label: 'Tir alien Plunger (3×8 px)' },
            { id: 'ph1-t17', label: 'Tir alien Squiggly (3×6 px)' },
            { id: 'ph1-t18', label: 'Police bitmap 5×7 px : chiffres 0–9' },
            { id: 'ph1-t19', label: 'Police bitmap 5×7 px : lettres S C O R E H I G A M V L P Y D T B' },
            { id: 'ph1-t20', label: 'Routine d\'affichage de texte' },
          ]
        },
        {
          id: 'phase-2',
          title: 'Phase 2 — Canon joueur & missile',
          deliverableLabel: 'Vidéo : le canon bouge, tire, le missile monte et disparaît',
          tasks: [
            { id: 'ph2-t1', label: 'Lire le joystick (Gauche / Droite / Feu)' },
            { id: 'ph2-t2', label: 'Convertir en intention Direction + Action_Feu' },
            { id: 'ph2-t3', label: 'Calculer X_nouveau selon Direction' },
            { id: 'ph2-t4', label: 'Bloquer le canon aux bords (0 et 319)' },
            { id: 'ph2-t5', label: 'Déclarer variables missile (X/Y + flag actif)' },
            { id: 'ph2-t6', label: 'Créer le missile à la position du canon sur Feu' },
            { id: 'ph2-t7', label: 'Un seul missile à la fois (ignorer Feu si actif)' },
            { id: 'ph2-t8', label: 'Déplacer le missile de 4 px vers le haut par frame' },
            { id: 'ph2-t9', label: 'Désactiver le missile sorti par le haut (délai 62 frames)' },
            { id: 'ph2-t10', label: 'Calculer adresses mémoire depuis X_ancien et X_actuel' },
            { id: 'ph2-t11', label: 'Restituer le décor à l\'ancienne position' },
            { id: 'ph2-t12', label: 'Sauvegarder le décor à la nouvelle position' },
            { id: 'ph2-t13', label: 'Afficher le sprite avec masque' },
            { id: 'ph2-t14', label: 'Copier X_actuel/Y_actuel dans X_ancien/Y_ancien' },
            { id: 'ph2-t15', label: 'Attendre VBL, inverser Adr_Visible/Adr_Travail' },
            { id: 'ph2-t16', label: 'Écrire la nouvelle Adr_Visible dans le Shifter' },
          ]
        },
        {
          id: 'phase-3',
          title: 'Phase 3 — Grille d\'aliens',
          deliverableLabel: 'Vidéo : la grille se déplace, s\'anime, descend aux bords et accélère',
          tasks: [
            { id: 'ph3-t1', label: 'Déclarer le tableau des 55 aliens (5×11)' },
            { id: 'ph3-t2', label: 'Pour chaque alien : X/Y, vivant/mort, frame A ou B' },
            { id: 'ph3-t3', label: 'Initialiser la grille aux positions de départ' },
            { id: 'ph3-t4', label: 'Déplacer toute la grille de 2 px horizontalement par step' },
            { id: 'ph3-t5', label: 'Détecter le bord : descendre 8 px + inverser direction' },
            { id: 'ph3-t6', label: 'Alterner frame A/B à chaque step' },
            { id: 'ph3-t7', label: 'Compter les aliens vivants restants' },
            { id: 'ph3-t8', label: 'Implémenter la table de délai (43 frames → 4 frames)' },
            { id: 'ph3-t9', label: 'Condition game over : alien atteint la ligne joueur' },
            { id: 'ph3-t10', label: 'Afficher les aliens vivants avec le bon sprite/type' },
            { id: 'ph3-t11', label: 'Ne pas afficher les aliens morts' },
          ]
        },
        {
          id: 'phase-4',
          title: 'Phase 4 — Collisions & score',
          deliverableLabel: 'Vidéo : un alien explose quand le missile le touche, le score s\'incrémente',
          tasks: [
            { id: 'ph4-t1', label: 'Tester si le missile est dans la zone d\'un alien vivant' },
            { id: 'ph4-t2', label: 'Tuer l\'alien + désactiver le missile à la collision' },
            { id: 'ph4-t3', label: 'Ajouter les points (Octopus 10, Crab 20, Squid 30)' },
            { id: 'ph4-t4', label: 'Afficher l\'explosion alien 12 frames à sa position' },
            { id: 'ph4-t5', label: 'Mettre à jour le compteur d\'aliens vivants' },
            { id: 'ph4-t6', label: 'Déclarer la variable score' },
            { id: 'ph4-t7', label: 'Mettre à jour "SCORE XXXXX" immédiatement après kill' },
            { id: 'ph4-t8', label: 'Afficher le hi-score "HI-SCORE XXXXX" en RAM' },
          ]
        },
        {
          id: 'phase-5',
          title: 'Phase 5 — Tirs aliens & mort du joueur',
          deliverableLabel: 'Vidéo : les aliens tirent, le joueur meurt, les vies s\'affichent',
          tasks: [
            { id: 'ph5-t1', label: 'Déclarer 3 emplacements de tirs aliens' },
            { id: 'ph5-t2', label: 'Rolling shot : colonne la plus proche du joueur' },
            { id: 'ph5-t3', label: 'Plunger shot : séquence de colonnes prédéfinie' },
            { id: 'ph5-t4', label: 'Squiggly shot : autre séquence prédéfinie' },
            { id: 'ph5-t5', label: 'Délai entre tirs selon score (48 → 7 frames)' },
            { id: 'ph5-t6', label: 'Tirs descendent 4 px/frame (5 px si ≤ 8 aliens)' },
            { id: 'ph5-t7', label: 'Collision tir alien → joueur : déclencher ETAT_MORT' },
            { id: 'ph5-t8', label: 'Collision tir joueur → tir alien : annulation mutuelle' },
            { id: 'ph5-t9', label: 'Geler 24 frames + afficher explosion joueur' },
            { id: 'ph5-t10', label: 'Retirer une vie + mettre à jour les icônes de vies' },
            { id: 'ph5-t11', label: 'Si vies > 0 : respawn après 3 secondes' },
            { id: 'ph5-t12', label: 'Si vies = 0 : → ETAT_GAME_OVER' },
          ]
        },
        {
          id: 'phase-6',
          title: 'Phase 6 — Bunkers',
          deliverableLabel: 'Vidéo : les bunkers s\'érodent au pixel, les tirs passent dans les trous',
          tasks: [
            { id: 'ph6-t1', label: 'Déclarer 4 bitmaps de 22×16 px (44 octets chacun)' },
            { id: 'ph6-t2', label: 'Initialiser les bitmaps à la forme initiale' },
            { id: 'ph6-t3', label: 'Dessiner chaque bunker depuis son bitmap' },
            { id: 'ph6-t4', label: 'Tir joueur → bunker : éroder + désactiver tir' },
            { id: 'ph6-t5', label: 'Tir alien → bunker : éroder + désactiver tir' },
            { id: 'ph6-t6', label: 'Tirs passent dans les trous (tester bit avant collision)' },
            { id: 'ph6-t7', label: 'Bitmaps persistent entre niveaux (pas de reset)' },
          ]
        },
        {
          id: 'phase-7',
          title: 'Phase 7 — UFO',
          deliverableLabel: 'Vidéo : l\'UFO traverse l\'écran et donne le bon score à la destruction',
          tasks: [
            { id: 'ph7-t1', label: 'UFO n\'apparaît que si ≥ 8 aliens vivants' },
            { id: 'ph7-t2', label: 'Direction selon parité du nb de tirs tirés' },
            { id: 'ph7-t3', label: 'Désactiver Squiggly shot pendant l\'UFO' },
            { id: 'ph7-t4', label: 'Implémenter la table de scores cyclique (15 entrées)' },
            { id: 'ph7-t5', label: 'Afficher le score à la position UFO pendant 1 seconde' },
            { id: 'ph7-t6', label: 'Retirer l\'UFO silencieusement s\'il sort sans être touché' },
          ]
        },
        {
          id: 'phase-8',
          title: 'Phase 8 — Son (YM2149)',
          deliverableLabel: 'Vidéo avec son : la marche joue et accélère, tous les effets se déclenchent',
          tasks: [
            { id: 'ph8-t1', label: 'Table des 4 fréquences de la marche' },
            { id: 'ph8-t2', label: 'Compteur de tempo synchronisé sur la VBL' },
            { id: 'ph8-t3', label: 'Cycle notes 1→2→3→4→1 sur canal A' },
            { id: 'ph8-t4', label: 'Tempo lié à la table de délais des aliens' },
            { id: 'ph8-t5', label: 'Marche active uniquement pendant ETAT_JOUER' },
            { id: 'ph8-t6', label: 'Drone UFO canal B (démarrer/arrêter avec l\'UFO)' },
            { id: 'ph8-t7', label: 'Tir joueur : sweep montant ~30ms canal C' },
            { id: 'ph8-t8', label: 'Mort alien : bruit blanc descendant ~100ms' },
            { id: 'ph8-t9', label: 'Mort joueur : glissando 3 notes ~150ms' },
            { id: 'ph8-t10', label: 'UFO touché : burst montant ~50ms' },
            { id: 'ph8-t11', label: 'Bonus vie : double bip' },
            { id: 'ph8-t12', label: 'Game over : 3 notes descendantes 400→300→200 Hz' },
            { id: 'ph8-t13', label: 'Démarrage partie : 3 notes montantes 200→300→400 Hz' },
          ]
        },
        {
          id: 'phase-9',
          title: 'Phase 9 — Machine à états complète',
          deliverableLabel: 'Vidéo du jeu complet : titre → ready → gameplay → game over → retour titre',
          tasks: [
            { id: 'ph9-t1', label: 'TITRE → READY : appui bouton feu' },
            { id: 'ph9-t2', label: 'READY → JOUER : après 3 secondes' },
            { id: 'ph9-t3', label: 'JOUER → MORT : tir alien touche le joueur' },
            { id: 'ph9-t4', label: 'MORT → JOUER : vies > 0, après 3 secondes' },
            { id: 'ph9-t5', label: 'MORT → GAME_OVER : vies = 0' },
            { id: 'ph9-t6', label: 'JOUER → GAME_OVER : alien atteint la ligne joueur' },
            { id: 'ph9-t7', label: 'JOUER → NIVEAU_SUIVANT : tous les aliens tués' },
            { id: 'ph9-t8', label: 'GAME_OVER → TITRE : après 3 secondes' },
            { id: 'ph9-t9', label: 'ETAT_TITRE : logo + PRESS FIRE + hi-score' },
            { id: 'ph9-t10', label: 'ETAT_READY : "READY" centré + son démarrage + 3s' },
            { id: 'ph9-t11', label: 'ETAT_GAME_OVER : "GAME OVER" + son + 3s' },
            { id: 'ph9-t12', label: 'ETAT_NIVEAU_SUIVANT : reset grille, conserver bunkers, abaisser Y' },
            { id: 'ph9-t13', label: '3 vies au départ, bonus vie à 1 500 points (une fois)' },
            { id: 'ph9-t14', label: 'Icônes de vies en bas d\'écran' },
            { id: 'ph9-t15', label: 'Y départ : N1=64px, N2=80px, N3=96px, N4+=104px' },
          ]
        },
        {
          id: 'phase-10',
          title: 'Phase 10 — Polish & validation finale',
          deliverableLabel: 'Vidéo finale : jeu stable à 50fps, autoboot depuis la disquette',
          tasks: [
            { id: 'ph10-t1', label: 'Vérifier que tout tient dans ~160 000 cycles/frame' },
            { id: 'ph10-t2', label: 'Dirty rectangles : ne redessiner que les zones modifiées' },
            { id: 'ph10-t3', label: 'Aucun sprite ne déborde hors de l\'écran' },
            { id: 'ph10-t4', label: 'La grille descend bien aux bords' },
            { id: 'ph10-t5', label: 'Vitesse augmente perceptiblement avec les kills' },
            { id: 'ph10-t6', label: 'Un seul tir joueur à la fois' },
            { id: 'ph10-t7', label: '3 types de tirs aliens corrects' },
            { id: 'ph10-t8', label: 'Bunkers érodent + tirs passent dans les trous' },
            { id: 'ph10-t9', label: 'UFO : score table cyclique correct' },
            { id: 'ph10-t10', label: 'Vie bonus une seule fois à 1 500 points' },
            { id: 'ph10-t11', label: 'Marche s\'accélère avec les kills' },
            { id: 'ph10-t12', label: 'Pas de conflit entre canaux YM' },
            { id: 'ph10-t13', label: 'Autoboot depuis la disquette' },
            { id: 'ph10-t14', label: 'Taille totale < 720 Ko (1 disquette DD)' },
            { id: 'ph10-t15', label: 'Test sur ST 512 Ko minimum' },
          ]
        },
      ]
    },
    {
      slug: 'pac-man',
      title: 'Pac-Man-like',
      reference: 'Pac-Man (Namco, 1980)',
      difficulty: 'beginner-plus',
      difficultyLabel: 'Débutant+',
      image: '/images/projects/pacman.webp',
      description: 'Excellent premier projet "complet". La logique sur grille simplifie les collisions. L\'IA des fantômes est documentée et bien connue — un classique d\'enseignement.',
      skills: [
        { label: 'Tilemap à écran fixe' },
        { label: 'Déplacement sur grille' },
        { label: 'IA basique (4 comportements)' },
        { label: 'Collisions sur grille' },
        { label: 'Score & niveaux' },
      ],
      phases: []
    },
    {
      slug: 'shmup-vertical',
      title: 'Shoot\'em up vertical',
      reference: 'River Raid, Twin Hawk (Atari ST)',
      difficulty: 'intermediate',
      difficultyLabel: 'Intermédiaire',
      image: '/images/projects/riverraid.webp',
      description: 'Réutilise 80% de ce qu\'on fait sur Space Invaders. Le scrolling vertical est plus simple que l\'horizontal sur ST. La gestion d\'une liste d\'entités est la brique clé.',
      skills: [
        { label: 'VBL + double buffering' },
        { label: 'Gestion de liste d\'entités' },
        { label: 'Scrolling vertical' },
        { label: 'Patterns d\'ennemis' },
        { label: 'Collisions multiples' },
      ],
      phases: []
    },
    {
      slug: 'platformer',
      title: 'Platformer type Mario',
      reference: 'Super Mario Bros (NES, 1985)',
      difficulty: 'advanced',
      difficultyLabel: 'Avancé',
      image: '/images/projects/supermario.webp',
      description: 'La physique de saut conditionne tout le ressenti du jeu. Le scrolling horizontal demande une gestion fine des bitplanes sur ST.',
      skills: [
        { label: 'Tilemap avec couche de collision' },
        { label: 'Physique de saut (gravité, inertie)' },
        { label: 'Scrolling horizontal' },
        { label: 'Animations sprite' },
        { label: 'IA ennemis simple' },
      ],
      phases: []
    },
    {
      slug: 'zelda-like',
      title: 'Zelda-like',
      reference: 'The Legend of Zelda (NES, 1986)',
      difficulty: 'intermediate',
      difficultyLabel: 'Intermédiaire',
      image: '/images/projects/zelda.webp',
      description: 'La logique d\'événements (portes, coffres, interrupteurs) demande une vraie architecture de données. Le choix de caméra est irréversible — il conditionne toute l\'architecture de la carte.',
      skills: [
        { label: 'Tilemap multi-couches' },
        { label: 'Système d\'inventaire' },
        { label: 'Gestion d\'événements' },
        { label: 'Combat au contact' },
        { label: 'Sauvegarde sur disquette' },
      ],
      phases: []
    },
    {
      slug: 'point-and-click',
      title: 'Point & Click',
      reference: 'Le Manoir de Mortevielle (Atari ST, 1987)',
      difficulty: 'advanced',
      difficultyLabel: 'Avancé',
      image: '/images/projects/monkey.webp',
      description: 'La complexité est dans la logique narrative, pas dans la performance. Le seul type de jeu sans contrainte forte de VBL. Le chargement dynamique d\'images depuis disquette est le vrai défi.',
      skills: [
        { label: 'Gestion de scènes' },
        { label: 'Système verbes/inventaire' },
        { label: 'Arbre de dialogues' },
        { label: 'Chargement dynamique' },
        { label: 'Moteur de script' },
      ],
      phases: []
    },
    {
      slug: 'demo',
      title: 'Démo scène',
      reference: 'Scène démo Atari ST',
      difficulty: 'intermediate',
      difficultyLabel: 'Intermédiaire',
      image: '/images/projects/demo.webp',
      description: 'Branche parallèle aux jeux. L\'objectif n\'est pas le gameplay mais impressionner. Chaque cycle CPU compte. La synchro effets/musique est la brique centrale.',
      skills: [
        { label: 'Raster effects (copper bars)' },
        { label: 'Scroller horizontal' },
        { label: 'Musique YM2149' },
        { label: 'Synchro VBL' },
        { label: 'Optimisation cycle-exact' },
      ],
      phases: []
    },
    {
      slug: 'rpg',
      title: 'RPG tour par tour',
      reference: 'Pokémon Jaune (GameBoy, 1998)',
      difficulty: 'expert',
      difficultyLabel: 'Expert',
      image: '/images/projects/pokemon.webp',
      description: 'Même en choisissant les variantes les plus simples, ce type cumule le plus grand nombre d\'états complexes. Base de données volumineuse, combat tour par tour, sauvegarde complète. Clairement pas un premier projet.',
      skills: [
        { label: 'Tilemap case par case' },
        { label: 'Base de données (créatures, attaques)' },
        { label: 'Combat tour par tour' },
        { label: 'Sauvegarde complète' },
        { label: 'Détection ST/STe' },
      ],
      phases: []
    },
  ]);

  getBySlug(slug: string): ProjectTemplate | undefined {
    return this.templates().find(t => t.slug === slug);
  }

  buildEmptyUserProject(template: ProjectTemplate, machineConfig: string): UserProject {
    const now = new Date().toISOString();
    return {
      id: crypto.randomUUID(),
      templateSlug: template.slug,
      title: template.title,
      machineConfig: machineConfig as any,
      status: 'active',
      startedAt: now,
      phases: template.phases.map((phase, index) => ({
        phaseId: phase.id,
        tasks: phase.tasks.map(task => ({ taskId: task.id, checked: false })),
        deliverableUrl: null,
        unlocked: index === 0,
        note: null,
        noteCreatedAt: null,
        noteUpdatedAt: null,
        startedAt: index === 0 ? now : null,
        completedAt: null,
        feltDifficulty: null,
      }))
    };
  }
}
