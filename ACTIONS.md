# ROADMAP — Space Invaders-like sur Atari ST
> Chaque phase doit être **terminée et validée** avant de passer à la suivante.
> Un livrable = quelque chose qui s'exécute et se voit à l'écran ou s'entend.

---

## PHASE PILOTE — Environnement & premier affichage
> **Livrable :** un carré s'affiche à l'écran sans clignoter.

> On ne peut pas construire le moteur (la boucle qui tourne) tant que les outils de base (les fonctions d'affichage) ne sont pas testés.
> La boucle suit toujours cet ordre : **Lire (Input) → Calculer (Logic) → Dessiner (Draw) → Flip**

[ ] Outils de développement :
    -[ ] Hatari configuré et lancé.
    -[ ] Assembleur fonctionnel (vasm ou Devpac).
    -[ ] Script de build + lancement automatique.

[ ] Écran & palette :
    -[ ] Passer en mode basse résolution (320×200, 16 couleurs).
    -[ ] Définir la palette : noir, blanc, vert, cyan, jaune, rouge, orange.
    -[ ] Afficher un carré blanc à position fixe → valider que ça s'affiche.

[ ] Double buffering :
    -[ ] Réserver l'espace mémoire pour deux écrans (Ecran_A et Ecran_B).
    -[ ] Initialiser le pointeur Adr_Visible (ce qu'on voit) et Adr_Travail (le chantier).
    -[ ] Installer le handler VBL (50 Hz).
    -[ ] Écrire la boucle principale : attendre VBL → dessiner sur Adr_Travail → échanger les pointeurs.
    -[ ] Valider : le carré s'affiche sans clignoter.

---

## PHASE 0 — Initialisation (Le Setup des variables)
> **Livrable :** la structure de données du jeu est en place, rien ne tourne encore.

> Avant de lancer la boucle, on prépare le terrain.

[ ] Définir les variables de position :
    -[ ] X_actuel : la position réelle de l'objet à l'instant T.
    -[ ] X_ancien : la position où l'objet a été dessiné au tour précédent.

[ ] Définir les limites :
    -[ ] Fixer la borne gauche (0) et la borne droite (319).

[ ] Charger les assets :
    -[ ] Charger en mémoire le sprite (l'image) et son masque (sa silhouette).
    -[ ] Charger en mémoire le décor (image de fond).

[ ] Définir la liste des états (le plan de la maison) :
    -[ ] ETAT_TITRE : l'attente du joueur (Press Start).
    -[ ] ETAT_READY : affichage "READY" avant le démarrage.
    -[ ] ETAT_JOUER : le gameplay actif.
    -[ ] ETAT_MORT : le joueur est touché, pause avant respawn ou game over.
    -[ ] ETAT_GAME_OVER : la fin de partie.
    -[ ] ETAT_NIVEAU_SUIVANT : tous les aliens tués, on prépare le niveau suivant.

[ ] Créer l'aiguilleur (le Switch) :
    -[ ] Au début de la phase Calculer, lire la variable JEU_ETAT.
    -[ ] Sauter vers la sous-routine correspondante (si 0 → Titre, si 1 → Ready, etc.).

---

## PHASE 1 — Sprites & rendu
> **Livrable :** chaque sprite s'affiche correctement à l'écran, immobile.

[ ] Format bitplane ST :
    -[ ] Comprendre le format 4 bitplanes entrelacés de l'Atari ST.
    -[ ] Écrire une routine d'affichage de sprite à position alignée sur 16px.
    -[ ] Valider sur un sprite test quelconque.

[ ] Créer les sprites — graphismes (pixel art) :
    -[ ] Canon joueur (13×8 px) — forme rectangulaire + canon central.
    -[ ] Explosion joueur (16×8 px) — étoile 8 branches.
    -[ ] Octopus frame A (12×8 px).
    -[ ] Octopus frame B (12×8 px).
    -[ ] Crab frame A (11×8 px).
    -[ ] Crab frame B (11×8 px).
    -[ ] Squid frame A (8×8 px).
    -[ ] Squid frame B (8×8 px).
    -[ ] Explosion alien (16×8 px) — starburst irrégulier.
    -[ ] UFO (16×7 px) — forme elliptique.
    -[ ] Explosion UFO (16×8 px).
    -[ ] Tir joueur (1×8 px) — trait vertical.
    -[ ] Tir alien Rolling (1×7 px) — trait fin.
    -[ ] Tir alien Plunger (3×8 px) — forme piston.
    -[ ] Tir alien Squiggly (3×6 px) — forme sinueuse.

[ ] Police de caractères :
    -[ ] Créer la police bitmap 5×7 px : chiffres 0–9.
    -[ ] Créer les lettres nécessaires : S C O R E H I G A M V L P Y D T B.
    -[ ] Écrire la routine d'affichage de texte.

[ ] Valider l'affichage :
    -[ ] Afficher chaque sprite à l'écran, vérifier couleurs et dimensions.
    -[ ] Afficher le texte "SCORE 00000" — vérifier la lisibilité.

---

## PHASE 2 — Boucle principale : canon joueur & missile
> **Livrable :** le canon bouge, tire un missile, le missile monte et disparaît.

### 1. LIRE (Input — le test de touche)
> On ne bloque pas le jeu, on prend juste une "photo" de l'état du clavier.

[ ] Interroger le matériel (Clavier/Joystick) :
    -[ ] Tester si "Gauche" est pressé.
    -[ ] Tester si "Droite" est pressé.
    -[ ] Tester si "Feu" est pressé.

[ ] Convertir en intention :
    -[ ] Créer une variable temporaire Direction (-1, 0 ou +1) basée sur les touches pressées.
    -[ ] Créer un indicateur Action_Feu (vrai/faux).

### 2. CALCULER (Logic — la prédiction)
> On manipule des nombres pour savoir ce qui va se passer, avant de dessiner.

[ ] Canon joueur :
    -[ ] Calculer X_nouveau selon Direction.
    -[ ] Vérifier si X_nouveau dépasse les limites de l'écran — si oui, bloquer à la limite.
    -[ ] Mettre à jour X_actuel avec X_nouveau.

[ ] Missile joueur :
    -[ ] Déclarer les variables position X/Y du missile + flag actif/inactif.
    -[ ] Si Action_Feu et missile inactif → créer le missile à la position du canon.
    -[ ] Règle fondamentale : **un seul missile à la fois** — ignorer le feu si missile déjà actif.
    -[ ] Déplacer le missile de 4 px vers le haut par frame.
    -[ ] Si missile sort par le haut → le désactiver (délai 62 frames avant de pouvoir retirer).

### 3. DESSINER (Draw — l'exécution graphique)
> Toutes les adresses sont calculées par rapport à Adr_Travail.

[ ] Étape 0 — Traduction (calcul d'adresse) :
    -[ ] Convertir les coordonnées X_ancien / Y_ancien en adresse mémoire ancienne.
    -[ ] Convertir les coordonnées X_actuel / Y_actuel en adresse mémoire actuelle.

[ ] Étape 1 — Restituer le décor (nettoyage) :
    -[ ] Utiliser l'adresse ancienne pour effacer le sprite (remettre le décor original).

[ ] Étape 2 — Sauvegarder le décor (protection) :
    -[ ] Utiliser l'adresse actuelle pour copier le morceau de décor qui va être recouvert.

[ ] Étape 3 — Afficher le sprite (rendu) :
    -[ ] Dessiner le sprite à l'adresse actuelle en utilisant son masque pour la transparence.

[ ] Étape 4 — Synchroniser (préparation du prochain tour) :
    -[ ] Copier X_actuel et Y_actuel dans X_ancien et Y_ancien.

### 4. FLIP-FLOP (La Bascule)
> Cette phase ferme la boucle — elle présente le travail fini et prépare le tour suivant.

[ ] Synchronisation et permutation :
    -[ ] Attendre la fin du balayage écran (VBL).
    -[ ] Inverser les adresses contenues dans Adr_Visible et Adr_Travail.
    -[ ] Écrire la nouvelle adresse Adr_Visible dans les registres vidéo (Shifter).

---

## PHASE 3 — Grille d'aliens
> **Livrable :** la grille se déplace, s'anime, descend aux bords.

[ ] Structure de données :
    -[ ] Déclarer le tableau des 55 aliens (5 lignes × 11 colonnes).
    -[ ] Pour chaque alien : position X/Y, vivant/mort, frame courante (A ou B).
    -[ ] Initialiser la grille aux positions de départ.

[ ] Mouvement de la grille :
    -[ ] Déplacer toute la grille de 2 px horizontalement à chaque step.
    -[ ] Détecter quand un alien vivant touche le bord gauche ou droit.
    -[ ] Au toucher de bord : toute la grille descend de 8 px + inversion de direction.
    -[ ] À chaque step : alterner frame A/B de tous les aliens vivants.

[ ] Vitesse variable :
    -[ ] Compter les aliens vivants restants.
    -[ ] Implémenter la table de délai entre steps selon les aliens restants :
        -[ ] 50 aliens → 43 frames
        -[ ] 36 aliens → 32 frames
        -[ ] 22 aliens → 23 frames
        -[ ] 10 aliens → 16 frames
        -[ ] 5 aliens → 10 frames
        -[ ] 1 alien → 4 frames
    -[ ] Condition de game over : si un alien atteint la ligne Y du joueur → ETAT_GAME_OVER.

[ ] Affichage :
    -[ ] Afficher les aliens vivants avec le bon sprite selon leur type (Octopus/Crab/Squid).
    -[ ] Ne pas afficher les aliens morts.
    -[ ] Vérifier que l'animation A/B s'enclenche bien à chaque step.

---

## PHASE 4 — Collisions missile joueur → aliens & score
> **Livrable :** le missile tue un alien, le score s'incrémente, l'explosion s'affiche.

[ ] Collision missile → alien :
    -[ ] Pour chaque alien vivant : tester si le missile est dans sa zone.
    -[ ] Si collision : tuer l'alien (marquer mort), désactiver le missile.
    -[ ] Ajouter les points selon le type (Octopus 10 pts, Crab 20 pts, Squid 30 pts).
    -[ ] Afficher le sprite explosion alien pendant 12 frames à sa position.
    -[ ] Mettre à jour le compteur d'aliens vivants (recalcule la vitesse).

[ ] Affichage du score :
    -[ ] Déclarer la variable score.
    -[ ] Mettre à jour "SCORE XXXXX" immédiatement après chaque kill.
    -[ ] Déclarer et afficher le hi-score "HI-SCORE XXXXX" (stocké en RAM).

---

## PHASE 5 — Tirs aliens & mort du joueur
> **Livrable :** les aliens tirent, le joueur peut mourir, les vies s'affichent.

[ ] Structure des tirs aliens :
    -[ ] Déclarer 3 emplacements de tirs (max 3 simultanés à l'écran).
    -[ ] Pour chaque tir : position X/Y, type (Rolling / Plunger / Squiggly), actif/inactif.

[ ] Logique de tir :
    -[ ] Rolling shot : tire depuis l'alien vivant de la colonne la plus proche du joueur.
    -[ ] Plunger shot : suit une séquence de colonnes prédéfinie.
    -[ ] Squiggly shot : suit une autre séquence prédéfinie.
    -[ ] Délai entre tirs selon le score du joueur :
        -[ ] < 512 pts → 48 frames entre tirs.
        -[ ] 512–4095 pts → 16 frames.
        -[ ] 4096–8191 pts → 11 frames.
        -[ ] 8192–12287 pts → 8 frames.
        -[ ] ≥ 12288 pts → 7 frames.
    -[ ] Tirs descendent à 4 px/frame (5 px/frame si ≤ 8 aliens restants).

[ ] Collisions tirs aliens :
    -[ ] Tir alien → joueur : si collision → déclencher ETAT_MORT.
    -[ ] Tir joueur → tir alien : si collision → annulation mutuelle des deux.

[ ] ETAT_MORT — mort du joueur :
    -[ ] Geler toutes les actions pendant 24 frames.
    -[ ] Afficher le sprite explosion joueur pendant 24 frames.
    -[ ] Retirer une vie.
    -[ ] Mettre à jour l'affichage des vies (icônes petits canons en bas d'écran).
    -[ ] Si vies > 0 : respawn au centre bas après 3 secondes → ETAT_JOUER.
    -[ ] Si vies = 0 : → ETAT_GAME_OVER.

---

## PHASE 6 — Bunkers
> **Livrable :** les bunkers s'érodent au pixel sous les tirs.

[ ] Structure des bunkers :
    -[ ] Déclarer 4 bitmaps de 22×16 px (44 octets chacun).
    -[ ] Initialiser les bitmaps à la forme initiale (forteresse).

[ ] Affichage :
    -[ ] Dessiner chaque bunker depuis son bitmap (pas un sprite statique).
    -[ ] Redessiner uniquement les zones modifiées chaque frame.

[ ] Érosion :
    -[ ] Tir joueur → bunker : mettre à zéro les bits à la forme exacte du tir, désactiver le tir.
    -[ ] Tir alien → bunker : mettre à zéro les bits à la forme exacte du tir, désactiver le tir.
    -[ ] Vérifier que les tirs passent à travers les trous déjà creusés (tester le bit avant collision).
    -[ ] Les bitmaps persistent entre les niveaux (pas de régénération).

---

## PHASE 7 — UFO
> **Livrable :** l'UFO traverse l'écran, peut être détruit pour des points.

[ ] Apparition :
    -[ ] L'UFO n'apparaît que si 8 aliens ou plus sont encore vivants.
    -[ ] Direction : nb de tirs pair → droite vers gauche / impair → gauche vers droite.
    -[ ] Vitesse : 2 px par step. Un seul UFO à la fois.

[ ] Comportement :
    -[ ] Désactiver le tir alien Squiggly pendant la présence de l'UFO.
    -[ ] Si l'UFO sort de l'écran sans être touché → le retirer silencieusement.

[ ] Collision missile joueur → UFO :
    -[ ] Implémenter la table de scores cyclique (15 entrées : 100/50/50/100/150/100/100/50/300/100/100/100/50/150/100).
    -[ ] Le pointeur avance d'un cran à chaque tir (touché ou raté), boucle après l'index 14.
    -[ ] À la destruction : afficher le score à la position de l'UFO pendant 1 seconde.

---

## PHASE 8 — Son (YM2149)
> **Livrable :** tous les sons fonctionnent, la marche accélère avec les kills.

[ ] Son de marche — canal A :
    -[ ] Créer la table des 4 fréquences (notes 1 à 4 du jeu original).
    -[ ] Implémenter le compteur de tempo synchronisé sur la VBL.
    -[ ] À chaque step : jouer la note suivante (cycle 1→2→3→4→1…).
    -[ ] Lier le tempo à la même table de délais que la vitesse des aliens.
    -[ ] La marche joue en continu pendant ETAT_JOUER, s'arrête hors gameplay.

[ ] Son UFO — canal B :
    -[ ] Démarrer le drone (~150 Hz avec vibrato) à l'apparition de l'UFO.
    -[ ] Arrêter le drone à la destruction ou à la sortie de l'écran.

[ ] Effets sonores — canal C :
    -[ ] Tir joueur : sweep montant ~30ms.
    -[ ] Mort alien : bruit blanc descendant ~100ms.
    -[ ] Mort joueur : glissando 3 notes descendantes ~150ms.
    -[ ] UFO touché : burst montant ~50ms.
    -[ ] Bonus vie : double bip.
    -[ ] Game over : 3 notes descendantes 400→300→200 Hz.
    -[ ] Démarrage partie : 3 notes montantes 200→300→400 Hz.

---

## PHASE 9 — Machine à états complète
> **Livrable :** toutes les transitions entre écrans fonctionnent.

### 2. CALCULER (Logic) — Gestion des états
> Sans gestion d'états, le code essaierait d'afficher des aliens pendant l'écran titre ou de lire le joystick alors que le joueur est mort.

[ ] Définir les conditions de transition (les portes) :
    -[ ] TITRE → READY : appui bouton feu.
    -[ ] READY → JOUER : après 3 secondes (jouer le son de démarrage).
    -[ ] JOUER → MORT : tir alien touche le joueur.
    -[ ] MORT → JOUER : si vies > 0, après 3 secondes.
    -[ ] MORT → GAME_OVER : si vies = 0.
    -[ ] JOUER → GAME_OVER : alien atteint la ligne joueur.
    -[ ] JOUER → NIVEAU_SUIVANT : tous les aliens tués.
    -[ ] GAME_OVER → TITRE : après 3 secondes.

[ ] ETAT_TITRE :
    -[ ] Afficher logo + "PRESS FIRE TO START" + hi-score.
    -[ ] La marche ne joue pas.

[ ] ETAT_READY :
    -[ ] Afficher "READY" centré.
    -[ ] Jouer le son de démarrage.
    -[ ] Attendre 3 secondes.

[ ] ETAT_GAME_OVER :
    -[ ] Afficher "GAME OVER".
    -[ ] Jouer le son game over.
    -[ ] Attendre 3 secondes.

[ ] ETAT_NIVEAU_SUIVANT :
    -[ ] Réinitialiser la grille (55 aliens, tous vivants).
    -[ ] Conserver les bitmaps des bunkers (pas de reset).
    -[ ] Abaisser le Y de départ selon le niveau :
        -[ ] Niveau 1 → Y = 64 px.
        -[ ] Niveau 2 → Y = 80 px.
        -[ ] Niveau 3 → Y = 96 px.
        -[ ] Niveau 4+ → Y = 104 px.
    -[ ] Retourner à ETAT_READY.

[ ] Système de vies :
    -[ ] 3 vies au départ.
    -[ ] Bonus vie unique à 1 500 points.
    -[ ] Afficher les icônes de vies (petits canons) en bas d'écran.

---

## PHASE 10 — Polish & validation finale
> **Livrable :** le jeu tourne à 50 fps stables, sans artefacts, prêt pour la disquette.

[ ] Optimisation :
    -[ ] Vérifier que toute la logique tient dans les ~160 000 cycles par frame (8 MHz / 50 Hz).
    -[ ] Optimiser le rendu : ne redessiner que les zones modifiées (dirty rectangles).
    -[ ] Vérifier qu'aucun sprite ne déborde hors de l'écran.

[ ] Validation gameplay :
    -[ ] La grille descend bien quand elle touche un bord.
    -[ ] La vitesse augmente perceptiblement à mesure qu'on tue des aliens.
    -[ ] Un seul tir joueur à la fois.
    -[ ] Les 3 types de tirs aliens se comportent correctement.
    -[ ] Les bunkers s'érodent et les tirs passent à travers les trous.
    -[ ] L'UFO apparaît, se déplace, donne le bon score selon la table.
    -[ ] La vie bonus se déclenche une seule fois à 1 500 points.
    -[ ] Niveau suivant : grille reset, bunkers conservés, Y de départ abaissé.
    -[ ] Game over si alien atteint la ligne joueur.

[ ] Validation son :
    -[ ] La marche joue pendant tout le gameplay.
    -[ ] Le tempo s'accélère avec les kills.
    -[ ] Tous les effets aux bons moments.
    -[ ] Pas de conflit entre canaux YM.

[ ] Packaging :
    -[ ] Autoboot depuis la disquette.
    -[ ] Taille totale < 720 Ko (1 disquette DD).
    -[ ] Test sur configuration ST 512 Ko minimum.

---

*Roadmap créée le 2026-03-25 — basée sur PROJET_SPACE_INVADERS.md*
