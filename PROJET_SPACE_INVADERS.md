# Projet : Space Invaders-like sur Atari ST
## Guide complet par phases — Code / Graphismes / Son

> Sources : désassemblage ROM original (computerarcheology.com), Ken Shirriff (chip 76477), Ron Jeffries, Nick Tasios, Brian Koponen.

---

## CE QU'EST VRAIMENT SPACE INVADERS

- Grille **5 lignes × 11 colonnes = 55 aliens** au total
- **3 types d'aliens** (du bas vers le haut) :
  - Lignes 0-1 : Octopus — 10 points — 12×8 px
  - Lignes 2-3 : Crab — 20 points — 11×8 px
  - Ligne 4 : Squid — 30 points — 8×8 px
- **4 bunkers** érodables au pixel entre le joueur et les aliens
- **1 UFO** qui traverse le haut de l'écran ponctuellement
- **1 canon joueur** qui se déplace sur l'axe horizontal en bas d'écran
- **Un seul tir joueur** à la fois — règle fondamentale du gameplay
- La **vitesse des aliens augmente** automatiquement à mesure qu'on les tue
- Le **son de marche** (4 notes) accélère en parallèle selon la même logique
- Les bunkers s'érodent **au pixel** — chaque tir creuse la forme exacte du projectile

---

## MACHINE À ÉTATS DU JEU

```
INIT / BOOT
     ↓
ÉCRAN TITRE (attract mode)
     ↓ appui bouton
DÉMARRAGE PARTIE ("READY" — 3 secondes)
     ↓
BOUCLE GAMEPLAY ←──────────────────────────┐
     ↓                                      │
  alien tué → score + son                  │
  joueur touché → explosion + pause        │
  dernier alien tué → niveau suivant ──────┤
  alien atteint le bas → GAME OVER        │
  plus de vies → GAME OVER               │
     ↓                                      │
GAME OVER (3 secondes)                      │
     ↓                                      │
Retour ÉCRAN TITRE ────────────────────────-┘
```

---

## PHASE 0 — MISE EN PLACE DE L'ENVIRONNEMENT

> Avant toute logique jeu, l'environnement de développement doit fonctionner.

### 💻 Code
- [ ] Installer et configurer **Hatari** (émulateur Atari ST)
- [ ] Installer un assembleur 68000 (**vasm** ou **Devpac**)
- [ ] Créer la structure du projet (fichiers sources, Makefile, script de lancement)
- [ ] Écrire un programme minimal qui s'exécute et affiche une couleur de fond
- [ ] Mettre en place le **handler VBL** (interruption verticale 50 Hz)
- [ ] Écrire la **boucle principale** synchronisée sur la VBL

### 🎨 Graphismes
- [ ] Choisir la résolution : **320×200, 16 couleurs** (mode basse résolution ST)
- [ ] Comprendre le format **bitplane ST** (4 plans de bits entrelacés)
- [ ] Définir la palette de 8 couleurs suffisantes :
  - Noir (fond), blanc/vert (Octopus), cyan (Crab), jaune (Squid), rouge (explosions), vert (bunkers), orange (UFO), blanc (joueur/tirs/texte)

### 🔊 Son
- [ ] Vérifier l'accès au **YM2149** (chip son de l'Atari ST)
- [ ] Tester : faire jouer une note simple sur un canal

---

## PHASE 1 — RENDU DE BASE

> Afficher des objets à l'écran. Rien ne bouge encore.

### 💻 Code
- [ ] Routine d'**effacement d'écran**
- [ ] Routine d'**affichage de sprite** (variante 🟢 : aligné sur 16px / variante 🟡 : position quelconque)
- [ ] Routine d'**effacement de sprite** (redessiner le fond à la position)
- [ ] Routine d'**affichage de texte** (police bitmap 5×7) pour le score
- [ ] Tester : afficher chaque type d'alien à une position fixe, vérifier les couleurs

### 🎨 Graphismes — Tous les sprites à créer

Chaque alien a **2 frames d'animation** (A et B) qui alternent à chaque déplacement.

**Octopus (12×8 px — 2 frames) :**
```
Frame A :  ..@@@@@@@@..     Frame B :  ..@@@@@@@@..
           @@@@@@@@@@@.                .@@@@@@@@@@@
           @@.@@@@@.@@.                .@@.@@@@@.@@
           @@@@@@@@@@..                ..@@@@@@@@@@
           ..@.....@...                ...@.....@..
           .@..@.@..@..                ..@..@.@..@.
```
**Crab (11×8 px — 2 frames) :**
```
Frame A :  ..@.....@..     Frame B :  ..@.....@..
           ...@...@...                @..@...@..@
           ..@@@@@@@..                ..@@@@@@@..
           .@@.@@@.@@.                .@@.@@@.@@.
           @@@@@@@@@@@                @@@@@@@@@@@
           .@.......@.                @@@@@@@@@@@
           @.........@                .@.......@.
```
**Squid (8×8 px — 2 frames) :**
```
Frame A :  ...@@...     Frame B :  ...@@...
           ..@@@@..                ..@@@@..
           .@@@@@@.                .@@@@@@.
           @@.@@.@@                @@.@@.@@
           @@@@@@@@                @@@@@@@@
           ..@..@..                .@....@.
           .@.@@.@.                @.@..@.@
           @.....@.                .@....@.
```
**Canon joueur (13×8 px) :** forme de base rectangulaire avec canon central
**Explosion joueur (16×8 px) :** étoile à 8 branches
**Explosion alien (16×8 px) :** starburst irrégulier
**UFO (16×7 px) :** forme de soucoupe elliptique
**Tir joueur (1×8 px) :** ligne verticale fine
**Tir alien type 1 — Rolling (1×7 px) :** trait fin
**Tir alien type 2 — Plunger (3×8 px) :** forme de piston
**Tir alien type 3 — Squiggly (3×6 px) :** forme sinueuse
**Police de caractères (5×7 px) :** chiffres 0-9 + lettres S,C,O,R,E,H,I,G,A,M,V,L,P,Y,D,T,B

### 🔊 Son
- Rien en phase 1

---

## PHASE 2 — LOGIQUE DES ALIENS

> La grille se déplace, les aliens s'animent. Le joueur ne tire pas encore.

### 💻 Code
- [ ] Définir la **structure de données** de la grille (55 entrées : vivant/mort, position X/Y, frame courante)
- [ ] Initialiser la grille (positions de départ, tous vivants, frame A)
- [ ] Routine de **déplacement de la grille** :
  - Déplacement horizontal de 2 px par step
  - Quand un alien vivant touche un bord → toute la grille descend de 8 px et repart dans l'autre sens
  - À chaque step : alterner la frame A/B de tous les aliens vivants
- [ ] Calculer le nombre d'aliens vivants après chaque mort
- [ ] Implémenter la **table de vitesse** (délai entre chaque step selon aliens restants) :

| Aliens restants | Délai (frames à 50Hz) |
|----------------|----------------------|
| 50 | 43 |
| 43 | 38 |
| 36 | 32 |
| 28 | 28 |
| 22 | 23 |
| 17 | 20 |
| 13 | 17 |
| 10 | 16 |
| 8 | 13 |
| 7 | 12 |
| 6 | 11 |
| 5 | 10 |
| 4 | 9 |
| 3 | 7 |
| 2 | 6 |
| 1 | 4 |

> Table originale (60Hz) adaptée pour 50Hz ST (×50/60).

- [ ] Condition de **game over** : si un alien atteint Y ≥ ligne joueur → fin de partie immédiate

### 🎨 Graphismes
- [ ] Vérifier que l'animation A/B est correcte à chaque step
- [ ] Vérifier qu'un alien mort n'est plus affiché

### 🔊 Son
- Rien en phase 2

---

## PHASE 3 — JOUEUR ET TIRS

> Le joueur bouge et tire. Les aliens tirent. Les collisions fonctionnent.

### 💻 Code

**Canon joueur :**
- [ ] Lire le joystick (port 1) ou les touches flèches
- [ ] Déplacer le joueur 2 px par frame gauche/droite, borné à l'écran
- [ ] Gérer **un seul tir joueur** à la fois
- [ ] Tir joueur : monte de 4 px par frame, disparaît au bord haut
- [ ] Après qu'un tir quitte l'écran sans rien toucher → délai de 62 frames avant de pouvoir retirer (règle originale anti-spam)

**Tirs aliens :**
- [ ] **3 types de tirs** avec logique de ciblage différente :
  - Rolling shot : vise toujours la colonne la plus proche du joueur
  - Plunger shot : suit une séquence de colonnes prédéfinie
  - Squiggly shot : suit une autre séquence prédéfinie
- [ ] Tirs aliens descendent à 4 px par frame (5 px si ≤ 8 aliens restants)
- [ ] Maximum **3 tirs aliens simultanés** à l'écran
- [ ] Délai entre tirs aliens selon le score cumulé :

| Score du joueur | Délai entre tirs aliens |
|----------------|------------------------|
| < 512 pts | 48 frames |
| 512 – 4 095 pts | 16 frames |
| 4 096 – 8 191 pts | 11 frames |
| 8 192 – 12 287 pts | 8 frames |
| ≥ 12 288 pts | 7 frames (maximum) |

**Collisions — ordre d'exécution obligatoire chaque frame :**
- [ ] 1. Déplacer le joueur
- [ ] 2. Déplacer la grille aliens
- [ ] 3. Déplacer les tirs aliens
- [ ] 4. Déplacer le tir joueur
- [ ] 5. Tir joueur vs bunkers → éroder les pixels du bunker
- [ ] 6. Tir joueur vs aliens → tuer l'alien, ajouter score, déclencher son
- [ ] 7. Tirs aliens vs bunkers → éroder les pixels du bunker
- [ ] 8. Tirs aliens vs joueur → mort du joueur
- [ ] 9. Tir joueur vs UFO → score UFO, son
- [ ] 10. Tir joueur vs tir alien → annulation mutuelle
- [ ] 11. Vérifier si alien a atteint la ligne joueur → game over

**Mort du joueur :**
- [ ] Sprite explosion affiché pendant 24 frames
- [ ] Toutes les actions gelées pendant l'explosion
- [ ] Retirer une vie
- [ ] Si vies > 0 : respawn au centre bas après 3s
- [ ] Si vies = 0 : aller à GAME OVER

**Bunkers :**
- [ ] Représenter chaque bunker comme un **bitmap 22×16 px** (44 octets par bunker)
- [ ] À la collision d'un tir : mettre à zéro les bits correspondant à la forme exacte du tir
- [ ] Redessiner chaque bunker depuis son bitmap chaque frame
- [ ] Vérifier que les tirs traversent les trous déjà creusés

### 🎨 Graphismes
- [ ] Dessiner les bunkers depuis leur bitmap (pas un sprite statique)
- [ ] Afficher le sprite d'explosion joueur pendant 24 frames
- [ ] Afficher le sprite d'explosion alien pendant 12-16 frames
- [ ] Afficher les icônes de vies en bas d'écran (petits canons)

### 🔊 Son
- Rien en phase 3

---

## PHASE 4 — SON

> Tout le système sonore du jeu sur le YM2149.

### 💻 Code

**Son de marche (4 notes en boucle, accélère avec les kills) :**

Les 4 notes (fréquences réelles tirées du jeu original) :
| Note | Fréquence | Valeur registre YM (horloge 2 MHz) |
|------|-----------|-----------------------------------|
| 1 | 92.5 Hz | 1350 |
| 2 | 87.3 Hz | 1432 |
| 3 | 82.4 Hz | 1517 |
| 4 | 77.8 Hz | 1608 |

- [ ] Créer la table des 4 fréquences
- [ ] Implémenter un compteur de tempo synchronisé sur la VBL
- [ ] À chaque step de tempo : jouer la note suivante (canal A), avancer dans le cycle 1→2→3→4→1…
- [ ] Utiliser la même table de délais que la vitesse des aliens (Phase 2) pour accélérer le tempo
- [ ] La marche joue **en continu** pendant tout le gameplay

**Effets sonores :**

| Effet | Déclencheur | Description |
|-------|-------------|-------------|
| Tir joueur | Appui bouton + tir créé | Sweep montant 300→800 Hz, canal C, ~30ms |
| Mort alien | Collision tir/alien | Bruit blanc descendant 1000→200 Hz, ~100ms |
| Mort joueur | Collision tir alien/joueur | Glissando descendant 3 notes, ~150ms |
| UFO drone | UFO présent à l'écran | Ton continu ~150 Hz avec vibrato, canal B, en boucle |
| UFO touché | Collision tir/UFO | Burst montant bref, ~50ms |
| Bonus vie | Score atteint seuil | Double bip distinctif |
| Game over | Fin de partie | 3 notes descendantes 400→300→200 Hz |
| Démarrage | Début de partie | 3 notes montantes 200→300→400 Hz |

- [ ] Routine `play_sfx(effet)` qui programme le YM pour jouer l'effet demandé
- [ ] Les effets courts s'arrêtent automatiquement après leur durée
- [ ] Le drone UFO (canal B) joue en boucle tant que l'UFO est à l'écran
- [ ] La marche (canal A) et le drone UFO (canal B) coexistent simultanément
- [ ] Les effets courts utilisent le canal C

### 🎨 Graphismes
- Rien en phase 4

### 🔊 Vérifications son
- [ ] La marche s'entend pendant tout le gameplay
- [ ] Le tempo s'accélère perceptiblement quand il reste peu d'aliens
- [ ] Tous les effets se déclenchent aux bons moments
- [ ] Pas de conflit entre les 3 canaux YM

---

## PHASE 5 — UFO

> Le vaisseau mystère apparaît et peut être détruit pour des points bonus.

### 💻 Code
- [ ] L'UFO n'apparaît que si **8 aliens ou plus** sont encore en vie
- [ ] Direction selon la parité du nombre de tirs tirés :
  - Nombre pair → entre par la droite, se déplace vers la gauche
  - Nombre impair → entre par la gauche, se déplace vers la droite
- [ ] Vitesse : 2 px par step
- [ ] Un seul UFO à la fois — le tir alien "squiggly" est désactivé pendant la présence de l'UFO
- [ ] Table de scores UFO (15 entrées cycliques, indexée par nombre de tirs tirés) :

| Index | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 |
|-------|---|---|---|---|---|---|---|---|---|---|----|----|----|----|-----|
| Score | 100 | 50 | 50 | 100 | 150 | 100 | 100 | 50 | **300** | 100 | 100 | 100 | 50 | 150 | 100 |

> Le pointeur avance d'un cran à chaque tir (touché ou raté), repart à 0 après l'index 14.
> Astuce : tirer exactement 23 tirs avant de toucher le premier UFO → score 300 pts (index 8).

- [ ] À la destruction : afficher le score à la position de l'UFO pendant 1s
- [ ] Si l'UFO sort de l'écran sans être touché : le retirer sans score

### 🎨 Graphismes
- [ ] Sprite UFO (16×7 px) qui se déplace horizontalement
- [ ] Sprite explosion UFO
- [ ] Affichage du score en chiffres à la position de l'UFO détruit

### 🔊 Son
- [ ] Démarrer le drone UFO (canal B) à l'apparition
- [ ] Arrêter le drone à la destruction ou à la sortie de l'écran
- [ ] Jouer l'effet "UFO touché" si destruction

---

## PHASE 6 — MACHINE À ÉTATS ET ÉCRANS

> Tous les moments du jeu s'enchaînent correctement.

### 💻 Code
- [ ] Implémenter la machine à états avec les états : INIT, TITLE, READY, PLAYING, DEATH, GAMEOVER, NEWLEVEL
- [ ] **État TITLE** : afficher le logo, "PRESS FIRE TO START", le hi-score (variante 🟡 : aliens animés en démo)
- [ ] **État READY** : afficher "READY" centré, attendre 3s, jouer le son de démarrage, passer à PLAYING
- [ ] **État PLAYING** : boucle principale (phases 2-5)
- [ ] **État DEATH** : geler 24 frames, retirer une vie, respawn ou GAMEOVER
- [ ] **État GAMEOVER** : afficher "GAME OVER" 3s, jouer le son, retour à TITLE
- [ ] **État NEWLEVEL** : réinitialiser la grille, réinitialiser les bunkers, abaisser la position de départ des aliens, retour à READY
- [ ] **Système de vies** : 3 vies au départ, vie bonus à **1 500 points** (une seule fois)
- [ ] **Score** : s'affiche en haut à gauche, mis à jour immédiatement à chaque kill
- [ ] **Hi-score** : stocké en RAM (variante 🟡 : sauvegarde sur disquette)

**Position de départ des aliens par niveau (Y depuis le haut) :**
| Niveau | Y départ |
|--------|---------|
| 1 | 64 px |
| 2 | 80 px |
| 3 | 96 px |
| 4 | 104 px |
| 5+ | 104 px |

### 🎨 Graphismes
- [ ] Écran titre : logo du jeu en pixel art ou texte bitmap
- [ ] Tous les textes en police 5×7 : "PRESS FIRE", "READY", "GAME OVER", "SCORE", "HI-SCORE", "LIVES"
- [ ] Icônes de vies (petits canons) en bas d'écran

### 🔊 Son
- [ ] Son de démarrage à l'entrée dans READY
- [ ] Son de game over à l'entrée dans GAMEOVER
- [ ] La marche cesse pendant TITLE, READY, GAMEOVER
- [ ] La marche reprend depuis la note 1 au début de chaque PLAYING

---

## PHASE 7 — POLISH ET OPTIMISATION

> Le jeu tourne, il faut le rendre fluide et stable.

### 💻 Code
- [ ] Mettre en place le **double buffering** (deux zones mémoire écran alternées à chaque VBL — élimine le scintillement)
- [ ] Optimiser le rendu : ne redessiner que les zones modifiées (**dirty rectangles**)
- [ ] Vérifier que tout le code tient dans les ~160 000 cycles disponibles par frame (8 MHz / 50 Hz)
- [ ] Vérifier qu'aucun tir ne passe à travers un alien (cohérence des collisions)
- [ ] Vérifier qu'aucun sprite ne déborde hors de l'écran
- [ ] Tester sur configuration Hatari précise (cycle-exact)

### 🎨 Graphismes
- [ ] Vérifier que l'animation alien ne scintille pas
- [ ] Vérifier que l'érosion des bunkers s'accumule correctement
- [ ] Vérifier la lisibilité du score sur toutes les valeurs

### 🔊 Son
- [ ] Vérifier l'absence de craquements ou d'artefacts audio
- [ ] Vérifier que la marche ne déraille pas si le code est lent

---

## CHECKLIST FINALE AVANT RELEASE

### Gameplay
- [ ] La grille descend bien quand elle touche un bord
- [ ] La vitesse augmente perceptiblement à mesure qu'on tue des aliens
- [ ] Un seul tir joueur à la fois
- [ ] Les 3 types de tirs aliens se comportent correctement
- [ ] Les bunkers s'érodent et les tirs passent à travers les trous
- [ ] L'UFO apparaît, se déplace, peut être détruit, donne le bon score
- [ ] La vie bonus se déclenche une fois à 1 500 points
- [ ] Le niveau suivant se déclenche correctement (grille reset, bunkers reset)
- [ ] Game over si un alien atteint la ligne joueur

### Son
- [ ] La marche joue pendant tout le gameplay
- [ ] Le tempo s'accélère avec les kills
- [ ] Tous les effets sonores aux bons moments
- [ ] Pas de conflit entre canaux YM

### Technique
- [ ] 50 fps stables
- [ ] Pas de scintillement (double buffer)
- [ ] Pas de crash après plusieurs parties
- [ ] Fonctionne sur ST 512 Ko minimum

### Packaging
- [ ] Autoboot depuis la disquette
- [ ] Taille totale < 720 Ko (1 disquette)

---

## RÉFÉRENCES

- Désassemblage ROM complet : computerarcheology.com/Arcade/SpaceInvaders/
- Hardware original : computerarcheology.com/Arcade/SpaceInvaders/Hardware.html
- Chip son 76477 : righto.com/2017/04/reverse-engineering-76477
- Boucliers érodables : raspberrypi.com/news/coding-space-invaders-disintegrating-shields-wireframe-9/
- Scores UFO : primetimeamusements.com/getting-good-space-invaders/

---

*Fichier créé le 2026-03-25 — basé sur sources primaires (désassemblage ROM + documentation hardware)*
