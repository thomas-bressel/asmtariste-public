# ASMtariSTe — Section "Projets Gold"
## Notes de réflexion & conception — Claude Code

---

## 1. POSITIONNEMENT DE LA SECTION

La section **Projets** est fondamentalement différente des articles de coding :
- Un article de coding enseigne une **technique isolée** (ex : scroller un fond en parallaxe)
- La section Projets enseigne à **orchestrer ces techniques** dans un projet cohérent, dans le bon ordre, au bon moment

Ce que les articles ne résolvent pas — et que la section Projets doit résoudre :
- Le débutant ne sait pas par quoi commencer
- Il ne sait pas comment découper le travail
- Il ne sait pas quand une étape est "finie"
- Il ne sait pas ce qu'il ne sait pas encore (les surprises en cours de route)
- Il abandonne parce qu'il perd le fil ou se sent submergé

---

## 2. LA QUESTION FONDAMENTALE AVANT TOUT : "AI-JE LES PRÉREQUIS ?"

### Le vrai angle mort du débutant

Le problème n'est pas "quel jeu veux-tu faire ?" — le débutant ne sait pas ce que ça implique techniquement.
Le bon sens c'est l'inverse : **"voilà ce que tu sais faire → voilà les projets que tu peux attaquer."**

L'utilisateur coche les notions qu'il a expérimentées dans les articles du site. Ce sont exactement les compétences couvertes par les articles de coding existants. **Chaque article débloque une compétence, chaque compétence débloque des types de projets.**

### Ce que le site affiche selon les coches

> ✅ **Tu peux commencer maintenant :** Space Invaders, Pac-Man
> ⚠️ **Il te manque 2 briques :** Shmup vertical — il te faut la gestion de liste d'entités et le scrolling
> ❌ **Pas encore :** Platformer — il te manque la physique de saut et la tilemap

Pour chaque brique manquante : **lien direct vers l'article du site qui l'enseigne.**

---

## 3. DEUX DIMENSIONS À CONFIGURER PAR PROJET

Chaque projet se configure selon deux dimensions indépendantes :

### Dimension 1 — Les états du jeu (game states)
Un jeu est une **machine à états**. Le gameplay n'est qu'un état parmi d'autres. Chaque état est une boucle autonome avec son propre affichage, sa propre gestion des inputs, sa propre logique. On entre dans un état, on en sort vers un autre.

```
BOOT / INIT
     ↓
ÉCRAN TITRE / MENU
     ↓
INTRO / CINÉMATIQUE (optionnel)
     ↓
BOUCLE GAMEPLAY  ←─────────────┐
     ↓                          │
  PAUSE                         │
  INVENTAIRE / CARTE / SHOP     │
  SÉQUENCE DE COMBAT            │
     ↓                          │
GAME OVER  ────────────────────→┘
     ↓
ÉCRAN DE FIN / GÉNÉRIQUE
```

Chaque état a ses **variantes de complexité** propres.

### Dimension 2 — Les variantes du moteur de gameplay
Pour chaque aspect technique du gameplay (caméra, physique, IA, collisions...), plusieurs implémentations possibles classées par niveau.

**Règle d'or commune aux deux dimensions : ces choix sont irréversibles sans tout refaire. Ils se font consciemment AVANT d'écrire une ligne de code.**

Niveaux utilisés dans tout le document :
- 🟢 **Débutant** — accessible dès les premiers articles du site
- 🟡 **Intermédiaire** — nécessite d'avoir pratiqué plusieurs briques
- 🔴 **Avancé** — réservé à ceux qui ont déjà terminé un projet

---

## 4. LES 8 TYPES DE JEUX RETENUS — FICHES TECHNIQUES

### Graduation globale par difficulté

La Démo est une **branche parallèle** — objectif différent des jeux (impressionner, pas divertir).

```
Space Invaders   (débutant)
      ↓
Pac-Man          (débutant+)
      ↓
Shmup vertical   (intermédiaire)       ← réutilise 80% de Space Invaders
Démo simple      (intermédiaire)       ← branche parallèle
      ↓
Platformer       (intermédiaire+)
      ↓
Point & Click    (avancé)
Zelda-like       (avancé)
      ↓
RPG tour/tour    (expert)
```

---

### 4.1 Space Invaders — 🟢 Débutant

#### États du jeu

| État | Présent | Variantes | Niveau |
|------|---------|-----------|--------|
| **Écran titre** | ✅ obligatoire | Texte fixe | 🟢 |
| **Écran titre** | | Animation d'ennemis en démo | 🟡 |
| **Gameplay** | ✅ obligatoire | — (c'est le cœur du jeu) | 🟢 |
| **Game over** | ✅ obligatoire | Écran texte simple | 🟢 |
| **Game over** | | Animation + hall of fame local | 🟡 |
| **Écran de fin** | optionnel | Message de victoire | 🟢 |
| **High scores** | optionnel | Liste en RAM (perdue à l'extinction) | 🟢 |
| **High scores** | | Sauvegarde sur disquette | 🟡 |

#### Variantes du moteur de gameplay

| Aspect | Variante | Niveau |
|--------|----------|--------|
| **Tirs ennemis** | Aléatoires simples | 🟢 |
| **Tirs ennemis** | Ciblés vers le joueur | 🟡 |
| **IA ennemis** | Grille qui bouge en bloc | 🟢 |
| **IA ennemis** | Patterns individuels par type | 🟡 |
| **Fond** | Fond noir fixe | 🟢 |
| **Fond** | Étoiles défilantes | 🟡 |
| **Collisions** | Rectangle englobant | 🟢 |
| **Collisions** | Pixel perfect | 🔴 |

**Pourquoi c'est le point d'entrée :** Toutes les briques sont simples, isolées, et directement réutilisables dans les projets suivants.

---

### 4.2 Pac-Man — 🟢 Débutant+

#### États du jeu

| État | Présent | Variantes | Niveau |
|------|---------|-----------|--------|
| **Écran titre** | ✅ obligatoire | Texte fixe | 🟢 |
| **Écran titre** | | Démo automatique (Pac-Man joué par l'IA) | 🔴 |
| **Cinématique inter-niveaux** | optionnel | Écran de score simple | 🟢 |
| **Cinématique inter-niveaux** | | Petite animation (cut-scene) | 🟡 |
| **Gameplay** | ✅ obligatoire | — | 🟢 |
| **Game over** | ✅ obligatoire | Écran texte | 🟢 |
| **High scores** | optionnel | En RAM | 🟢 |
| **High scores** | | Sauvegarde disquette | 🟡 |

#### Variantes du moteur de gameplay

| Aspect | Variante | Niveau |
|--------|----------|--------|
| **Labyrinthe** | Carte fixe codée en dur | 🟢 |
| **Labyrinthe** | Carte chargée depuis fichier | 🟡 |
| **IA fantômes** | Déplacement aléatoire | 🟢 |
| **IA fantômes** | Comportements distincts (Blinky, Pinky, Inky, Clyde) | 🟡 |
| **Niveaux** | Un seul niveau (vitesse croissante) | 🟢 |
| **Niveaux** | Labyrinthes différents par niveau | 🟡 |
| **Son** | Beeper simple | 🟢 |
| **Son** | YM2149 avec effets distincts | 🟡 |

---

### 4.3 Shoot'em up à défilement vertical — 🟡 Intermédiaire

#### États du jeu

| État | Présent | Variantes | Niveau |
|------|---------|-----------|--------|
| **Écran titre** | ✅ obligatoire | Texte fixe | 🟢 |
| **Écran titre** | | Démo de gameplay en fond | 🔴 |
| **Sélection de vaisseau** | optionnel | Absent | 🟢 |
| **Sélection de vaisseau** | | Choix parmi 2-3 vaisseaux avec stats | 🟡 |
| **Briefing de mission** | optionnel | Absent | 🟢 |
| **Briefing de mission** | | Texte de scénario avant chaque niveau | 🟡 |
| **Gameplay** | ✅ obligatoire | — | 🟡 |
| **Pause** | optionnel | Écran noir + texte | 🟢 |
| **Inter-niveaux** | optionnel | Score + bonus | 🟢 |
| **Inter-niveaux** | | Upgrade de vaisseau (shop) | 🔴 |
| **Boss** | optionnel | Absent | 🟢 |
| **Boss** | | Séquence boss dédiée (musique + patterns) | 🟡 |
| **Game over** | ✅ obligatoire | Écran texte | 🟢 |
| **Écran de fin** | optionnel | Message victoire | 🟢 |
| **Écran de fin** | | Cinématique de fin | 🔴 |

#### Variantes du moteur de gameplay

| Aspect | Variante | Niveau |
|--------|----------|--------|
| **Fond** | Fond fixe | 🟢 |
| **Fond** | Scrolling vertical simple | 🟡 |
| **Fond** | Scrolling différentiel multi-couches | 🔴 |
| **Ennemis** | Vagues prédéfinies fixes | 🟢 |
| **Ennemis** | Patterns de vol (formations, courbes) | 🟡 |
| **Ennemis** | IA réactive au joueur | 🔴 |
| **Tirs joueur** | Un seul tir à la fois | 🟢 |
| **Tirs joueur** | Tirs multiples + power-ups | 🟡 |
| **Collisions** | Rectangle englobant | 🟢 |
| **Collisions** | Pixel perfect | 🔴 |

---

### 4.4 Platformer type Super Mario NES — 🟡 Intermédiaire+

#### États du jeu

| État | Présent | Variantes | Niveau |
|------|---------|-----------|--------|
| **Écran titre** | ✅ obligatoire | Texte fixe | 🟢 |
| **Sélection de fichier de sauvegarde** | optionnel | Absent | 🟢 |
| **Sélection de fichier de sauvegarde** | | Choix parmi 3 slots | 🟡 |
| **Carte du monde** | optionnel | Absent (niveaux enchaînés) | 🟢 |
| **Carte du monde** | | Carte interactive avec niveaux débloquables | 🔴 |
| **Gameplay** | ✅ obligatoire | — | 🟡 |
| **Pause** | ✅ recommandé | Écran noir + texte | 🟢 |
| **Pause** | | Menu pause avec options | 🟡 |
| **Inter-niveaux** | optionnel | Score + vies | 🟢 |
| **Inter-niveaux** | | Mini-jeu de bonus | 🔴 |
| **Inventaire / power-ups** | optionnel | Absent (power-up immédiat) | 🟢 |
| **Inventaire / power-ups** | | Stock d'objets consultable | 🟡 |
| **Game over** | ✅ obligatoire | Écran texte | 🟢 |
| **Écran de fin de niveau** | ✅ recommandé | Score simple | 🟢 |
| **Générique de fin** | optionnel | Texte défilant | 🟡 |

#### Variantes du moteur de gameplay

| Aspect | Variante | Niveau |
|--------|----------|--------|
| **Caméra** | Écrans fixes | 🟢 |
| **Caméra** | Scrolling déclenché au bord | 🟡 |
| **Caméra** | Sprite centré, map défile en permanence | 🔴 |
| **Physique de saut** | Hauteur fixe | 🟢 |
| **Physique de saut** | Hauteur variable selon durée d'appui | 🟡 |
| **Physique de saut** | Inertie complète (glisse, accélération) | 🔴 |
| **IA ennemis** | Aller-retour simple | 🟢 |
| **IA ennemis** | Patrouille avec détection du joueur | 🟡 |
| **Tilemap** | Carte codée en dur | 🟢 |
| **Tilemap** | Carte chargée depuis fichier | 🟡 |

---

### 4.5 Point & Click type Manoir de Mortevielle — 🔴 Avancé

#### États du jeu

| État | Présent | Variantes | Niveau |
|------|---------|-----------|--------|
| **Écran titre** | ✅ obligatoire | Texte fixe | 🟢 |
| **Écran titre** | | Illustration animée | 🟡 |
| **Intro / scénario** | ✅ recommandé | Texte simple | 🟢 |
| **Intro / scénario** | | Texte avec illustrations | 🟡 |
| **Gameplay (exploration)** | ✅ obligatoire | — | 🔴 |
| **Consultation inventaire** | ✅ obligatoire | Liste textuelle | 🟡 |
| **Consultation inventaire** | | Inventaire graphique avec icônes | 🔴 |
| **Dialogues PNJ** | ✅ obligatoire | Texte linéaire | 🟡 |
| **Dialogues PNJ** | | Arbre de choix | 🔴 |
| **Combinaison d'objets** | optionnel | Absent (objets à usage unique) | 🟡 |
| **Combinaison d'objets** | | Combinaisons entre objets de l'inventaire | 🔴 |
| **Écran de fin** | ✅ obligatoire | Texte de conclusion | 🟡 |
| **Écran de fin** | | Plusieurs fins selon les choix | 🔴 |

#### Variantes du moteur de gameplay

| Aspect | Variante | Niveau |
|--------|----------|--------|
| **Interface** | Verbes fixes (Prendre, Utiliser, Parler) | 🟡 |
| **Interface** | Verbes contextuels selon l'objet pointé | 🔴 |
| **Assets graphiques** | Tout en RAM (1 scène à la fois) | 🟡 |
| **Assets graphiques** | Chargement dynamique depuis disquette | 🔴 |
| **État du jeu** | Variables booléennes simples | 🟡 |
| **État du jeu** | Moteur de script (conditions multiples) | 🔴 |

**Ce qui est particulier :** La complexité est dans la logique narrative et le moteur de script, pas dans la performance. C'est le seul type de jeu sans contrainte forte de VBL.

---

### 4.6 Zelda-like type Legend of Zelda NES — 🔴 Avancé

#### États du jeu

| État | Présent | Variantes | Niveau |
|------|---------|-----------|--------|
| **Écran titre** | ✅ obligatoire | Texte fixe | 🟢 |
| **Sélection / création de fichier** | ✅ recommandé | Absent (1 seul fichier) | 🟡 |
| **Sélection / création de fichier** | | 3 slots de sauvegarde | 🟡 |
| **Intro / scénario** | optionnel | Texte simple | 🟡 |
| **Gameplay (exploration)** | ✅ obligatoire | — | 🔴 |
| **Pause / carte** | ✅ recommandé | Carte fixe révélée progressivement | 🟡 |
| **Pause / carte** | | Carte interactive avec annotations | 🔴 |
| **Inventaire** | ✅ obligatoire | Objets clés uniquement | 🟢 |
| **Inventaire** | | Inventaire complet avec équipement | 🟡 |
| **Inventaire** | | Inventaire + stats + équipement actif | 🔴 |
| **Shop / marchand** | optionnel | Absent | 🟢 |
| **Shop / marchand** | | Écran dédié avec liste d'achats | 🟡 |
| **Dialogue PNJ** | ✅ recommandé | Texte simple | 🟡 |
| **Dialogue PNJ** | | Arbre de choix | 🔴 |
| **Game over** | ✅ obligatoire | Retour à l'écran titre | 🟢 |
| **Game over** | | Retour au dernier point de sauvegarde | 🟡 |
| **Générique de fin** | ✅ recommandé | Texte défilant | 🟡 |

#### Variantes du moteur de gameplay

| Aspect | Variante | Niveau |
|--------|----------|--------|
| **Caméra** | Écran par écran (transition instantanée) | 🟢 |
| **Caméra** | Scrolling déclenché au bord | 🟡 |
| **Caméra** | Sprite centré, map défile en permanence | 🔴 |
| **Combat** | Contact simple (toucher = dégât) | 🟢 |
| **Combat** | Arme directionnelle (épée avec hitbox) | 🟡 |
| **Combat** | Armes multiples avec effets distincts | 🔴 |
| **Carte** | Codée en dur | 🟢 |
| **Carte** | Chargée depuis fichier | 🟡 |
| **Événements** | Flags booléens simples | 🟡 |
| **Événements** | Système de script (conditions multiples) | 🔴 |
| **Sauvegarde** | Mot de passe | 🟢 |
| **Sauvegarde** | Fichier sur disquette | 🟡 |

**Règle d'or :** Le choix de caméra conditionne toute l'architecture de la carte — c'est le premier choix, avant tout autre.

---

### 4.7 Démo simple — 🟡 Intermédiaire (branche parallèle)

**Ce qui est fondamentalement différent d'un jeu :** pas de gameplay, pas de machine à états complexe. La structure est linéaire : une séquence de parties qui s'enchaînent.

#### Structure des séquences (remplace les états)

| Séquence | Présent | Variantes | Niveau |
|----------|---------|-----------|--------|
| **Loader / écran de chargement** | ✅ obligatoire | Écran noir avec barre | 🟢 |
| **Loader** | | Loader animé (logo, musique) | 🟡 |
| **Intro (nom du groupe)** | ✅ recommandé | Texte fixe fondu | 🟢 |
| **Intro** | | Logo animé avec effets | 🟡 |
| **Partie principale (effets)** | ✅ obligatoire | 1 effet + scroller + musique | 🟢 |
| **Partie principale** | | Plusieurs effets enchaînés | 🟡 |
| **Outro / greetz** | optionnel | Texte défilant | 🟢 |

#### Variantes des effets

| Aspect | Variante | Niveau |
|--------|----------|--------|
| **Effet visuel** | Copper bars | 🟢 |
| **Effet visuel** | Raster avancé (dégradés, ondulations) | 🔴 |
| **Scroller** | Horizontal simple | 🟢 |
| **Scroller** | Sinusoïdal (texte qui ondule) | 🟡 |
| **Musique** | YM2149 (chiptune natif ST) | 🟢 |
| **Musique** | MOD player (samples) | 🔴 |
| **Synchro** | Effets non synchronisés avec la musique | 🟢 |
| **Synchro** | Effets déclenchés sur les temps musicaux | 🟡 |

**Périmètre démo simple retenu :** loader + intro texte + copper bars + scroller horizontal + musique YM2149 + synchro VBL basique.

---

### 4.8 RPG tour par tour type Pokémon Jaune GameBoy — 🔴 Expert

#### États du jeu

| État | Présent | Variantes | Niveau |
|------|---------|-----------|--------|
| **Écran titre** | ✅ obligatoire | Texte fixe | 🟢 |
| **Intro / scénario** | ✅ recommandé | Texte simple | 🟡 |
| **Intro** | | Texte + illustrations | 🔴 |
| **Sélection de fichier** | ✅ obligatoire | 1 seul fichier | 🟡 |
| **Sélection de fichier** | | 3 slots | 🟡 |
| **Gameplay (exploration)** | ✅ obligatoire | — | 🔴 |
| **Menu de pause** | ✅ obligatoire | Accès inventaire + carte + équipe | 🟡 |
| **Inventaire** | ✅ obligatoire | Liste d'objets simple | 🟡 |
| **Inventaire** | | Catégories + descriptions + utilisation | 🔴 |
| **Équipe / créatures** | ✅ obligatoire | Liste avec HP | 🟡 |
| **Équipe / créatures** | | Fiche complète par créature (stats, attaques, XP) | 🔴 |
| **Carte du monde** | optionnel | Absent | 🟡 |
| **Carte du monde** | | Carte révélée progressivement | 🔴 |
| **Séquence de combat** | ✅ obligatoire | Stats simples + 4 attaques | 🟡 |
| **Séquence de combat** | | Types, effets de statut, PP, fuite | 🔴 |
| **Shop / centre de soin** | ✅ recommandé | Soin instantané sans menu | 🟡 |
| **Shop / centre de soin** | | Menu d'achat avec monnaie | 🔴 |
| **Dialogue PNJ** | ✅ obligatoire | Texte linéaire | 🟡 |
| **Dialogue PNJ** | | Arbre de choix | 🔴 |
| **Game over** | ✅ obligatoire | Retour au dernier centre de soin | 🟡 |
| **Générique de fin** | ✅ recommandé | Texte défilant | 🟡 |

#### Variantes du moteur de gameplay

| Aspect | Variante | Niveau |
|--------|----------|--------|
| **Caméra** | Case par case, écran par écran | 🟡 |
| **Caméra** | Case par case, scrolling | 🔴 |
| **Base de données** | Quelques créatures codées en dur | 🟡 |
| **Base de données** | Données chargées depuis fichier | 🔴 |
| **Sauvegarde** | Mot de passe (état limité) | 🟡 |
| **Sauvegarde** | Fichier complet sur disquette | 🔴 |
| **Son** | YM2149 uniquement | 🟡 |
| **Son** | Détection ST/STe + DMA samples si STe | 🔴 |

**Pourquoi c'est Expert :** Même en choisissant les variantes les plus simples, ce type cumule simultanément le plus grand nombre d'états complexes. Clairement pas un premier projet.

---

## 5. MÉCANIQUE D'ENTRÉE DANS LA SECTION

1. L'utilisateur coche ses compétences acquises → le site affiche les types de projets accessibles
2. Il choisit un type de jeu
3. Le site lui présente **les deux dimensions à configurer** : états du jeu + variantes du moteur
4. Il choisit une variante par aspect → son projet est calibré à son niveau, non bloquant
5. Le site génère sa feuille de route personnalisée

---

## 6. STRUCTURE D'UN PROJET GUIDÉ

### Premier livrable obligatoire : le document de faisabilité

Avant de coder quoi que ce soit :
- Ce que je veux faire
- Pourquoi c'est réalisable sur cette machine
- Ce que j'inclus dans la V1
- Ce que j'exclus volontairement de la V1
- **Les états du jeu retenus**
- **Les variantes choisies pour chaque aspect du moteur**

Un projet réussi = un projet **fini et limité**, pas ambitieux et abandonné.

### Structure des jalons

Chaque jalon doit avoir :
1. **Un livrable concret et vérifiable** — pas "faire le moteur", mais "afficher un sprite qui se déplace avec le joystick sans clignoter"
2. **Les prérequis** (liens vers articles du site)
3. **Les pièges anticipés** — documentés avec la solution
4. **Une action à accomplir** — pas juste du contenu à consommer

### Phases génériques d'un projet

```
Phase 0 : Concept & Faisabilité
  → document de faisabilité (GO/NO GO)
  → choix des états du jeu
  → choix des variantes moteur
  → vérification des prérequis personnels

Phase 1 : Prototype technique
  → prouver que les mécaniques CLÉS fonctionnent
  → moche mais fonctionnel

Phase 2 : Machine à états minimale
  → écran titre → gameplay → game over
  → rien de plus

Phase 3 : Moteur de gameplay
  → boucle de jeu, affichage, input
  → selon les variantes choisies

Phase 4 : États secondaires
  → pause, inventaire, shop, etc.
  → selon les états retenus

Phase 5 : Premier niveau jouable complet
  → un seul niveau, périmètre V1 strict

Phase 6 : Enrichissement
  → contenu, sons, musique, polish

Phase 7 : Release
  → tests, packaging, autoboot disquette
```

---

## 7. FONCTIONNALITÉS DE LA SECTION

### Indispensables
- [ ] Système de coches de compétences → projets accessibles calculés
- [ ] Liens compétences manquantes → articles existants du site
- [ ] Configurateur d'états du jeu par type (avec variantes et niveaux)
- [ ] Configurateur de variantes moteur par type (avec niveaux)
- [ ] Jalons avec critère de complétion clair
- [ ] Journal de bord de l'auteur (erreurs incluses, temps réels)
- [ ] "Où j'en suis" persistant — revenir après 3 semaines et retrouver exactement où reprendre

### Valeur ajoutée
- [ ] "Pièges de ce jalon" — anticipation des blocages courants
- [ ] Graphe de dépendances entre jalons
- [ ] Notion de périmètre V1 — outil pour définir ce qu'on exclut
- [ ] Timeline réelle vs estimée — honnêteté sur le temps que ça prend vraiment

### Pour maintenir la motivation
- [ ] Micro-succès visibles (jalons complétés, % de progression)
- [ ] Différencier "je lis" et "je fais" — chaque jalon a une action concrète
- [ ] Journal de bord interactif — l'utilisateur note ses propres avancées

### Gold exclusif
- [ ] Accès aux sources progressives de l'auteur (pas tout d'un coup)
- [ ] Fichiers de travail (structures de données, docs de conception)
- [ ] Archive PDF du projet complet

---

## 8. CE QUE LE SITE APPORTE QU'ON NE TROUVE NULLE PART AILLEURS

La plupart des tutos montrent le résultat final. ASMtariSTe peut montrer **le processus réel** :
- Les demi-tours
- Les erreurs de conception découvertes en cours de route
- Le temps que ça prend vraiment
- Les moments où on ne sait pas comment continuer

C'est ça qui est utile à quelqu'un qui fait son premier projet.

---

*Fichier créé le 2026-03-25 — Mis à jour le 2026-03-25*
