import { Injectable } from '@angular/core';

export interface Game {
  label: string;
  file: string;
  image: string; // base name: images/games/{image}-front-mini.webp / -front.webp / -back.webp
}

@Injectable({ providedIn: 'root' })
export class GameLibraryService {
  readonly games: Game[] = [
    { label: 'Another World - disk 1',   file: 'another-world-1991-delphine-disk1[cr][t][a].st',   image: 'another-world-1991-delphine' },
    { label: 'Another World - disk 2',   file: 'another-world-1991-delphine-disk2[cr].st',         image: 'another-world-1991-delphine' },
    { label: 'Atomino',                  file: 'atomino-1990-psygnosis[cr].st',                    image: 'atomino-1990-psygnosis' },
    { label: 'Batman the Movie',         file: 'batman-the-movie-1989-ocean[cr][t].st',            image: 'batman-the-movie-1989-ocean' },
    { label: 'Bubble Bobble',            file: 'bubble-bobble-1987-firebird[cr][t].st',            image: 'bubble-bobble-1987-firebird' },
    { label: 'Buggy Boy',                file: 'buggy-boy-1988-elite[cr].st',                      image: 'buggy-boy-1988-elite' },
    { label: 'Carrier Command',          file: 'carrier-command-1988-rainbird.st',                 image: 'carrier-command-1988-rainbird' },
    { label: 'Chaos Engine - disk 1',    file: 'chaos-engine-1993-renegade-disk1[cr].st',          image: 'chaos-engine-1993-renegade' },
    { label: 'Chaos Engine - disk 2',    file: 'chaos-engine-1993-renegade-disk2[cr].st',          image: 'chaos-engine-1993-renegade' },
    { label: 'Chuck Rock - disk 1',      file: 'chuck-rock-1991-core-design-disk1[cr][t].st',      image: 'chuck-rock-1991-core-design' },
    { label: 'Chuck Rock - disk 2',      file: 'chuck-rock-1991-core-design-disk2[cr][t].st',      image: 'chuck-rock-1991-core-design' },
    { label: 'Continental Circus',       file: 'continental-circus-1989-sales-curve[cr][a].st',    image: 'continental-circus-1989-sales-curve' },
    { label: 'Deuteros - disk 1',        file: 'deuteros-1991-activision-disk1[cr].st',            image: 'deuteros-1991-activision' },
    { label: 'Deuteros - disk 2',        file: 'deuteros-1991-activision-disk2[cr].st',            image: 'deuteros-1991-activision' },
    { label: 'Dragon Breed',             file: 'dragon-breed-1989-activision[cr][t][a].st',        image: 'dragon-breed-1989-activision' },
    { label: 'Dungeon Master',           file: 'dungeon-master-1987-ftl.st',                       image: 'dungeon-master-1987-ftl' },
    // { label: 'Exile',                    file: 'exile-1991-audiogenic[cr].st',                     image: 'exile-1991-audiogenic' },
    { label: 'Fire and Ice - disk 1',    file: 'fire-and-ice-1992-graftgold-disk1[cr].st',         image: 'fire-and-ice-1992-graftgold' },
    { label: 'Fire and Ice - disk 2',    file: 'fire-and-ice-1992-graftgold-disk2[cr].st',         image: 'fire-and-ice-1992-graftgold' },
    { label: 'Frontier - Elite II',      file: 'frontier-elite-ii-1993-frontier-developments.st',  image: 'frontier-elite-ii-1993-frontier-developments' },
    { label: 'Gauntlet II',              file: 'gauntlet-ii-1986-atari[cr][t].st',                 image: 'gauntlet-ii-1986-atari' },
    { label: "Ghosts 'n' Goblins",       file: 'ghosts-n-goblins-1990-elite[cr][t].st',            image: 'ghosts-n-goblins-1990-elite' },
    { label: 'Gods',                     file: 'gods-1991-renegade[cr][t].st',                     image: 'gods-1991-renegade' },
    // { label: 'Indy Heat',                file: 'indy-heat-1992-sales-curve[cr].st',                image: 'indy-heat-1992-sales-curve' },
    { label: 'International Karate+',    file: 'international-karate-plus-1988-system3.st',        image: 'international-karate-plus-1988-system3' },
    { label: 'James Pond II',            file: 'james-pond-ii-1992-vectordean[cr][t].st',          image: 'james-pond-ii-1992-vectordean' },
    { label: 'Kick Off',                 file: 'kick-off-1989-anco[cr].st',                        image: 'kick-off-1989-anco' },
    { label: 'Kid Gloves',               file: 'kid-gloves-1990-millennium[cr][t].st',             image: 'kid-gloves-1990-millennium' },
    { label: 'Lemmings',                 file: 'lemmings-1990-psygnosis[cr][t].st',                image: 'lemmings-1990-psygnosis' },
    { label: 'Lotus Esprit',             file: 'lotus-esprit-1990-gremlin[cr][a].st',              image: 'lotus-esprit-1990-gremlin' },
    { label: 'Nebulus',                  file: 'nebulus-1988-hewson[cr].st',                       image: 'nebulus-1988-hewson' },
    { label: 'Nitro',                    file: 'nitro-1990-psygnosis[cr][t][a].st',                image: 'nitro-1990-psygnosis' },
    { label: 'No Second Prize',          file: 'no-second-prize-1993-thalion[cr].st',              image: 'no-second-prize-1993-thalion' },
    { label: 'Oids',                     file: 'oids-1987-ftl[cr].st',                             image: 'oids-1987-ftl' },
    { label: 'Pang',                     file: 'pang-1990-ocean[cr][t][a].st',                     image: 'pang-1990-ocean' },
    { label: 'Prince of Persia',         file: 'prince-of-persia-1990-broderbund[m].st',           image: 'prince-of-persia-1990-broderbund' },
    { label: 'Rick Dangerous',           file: 'rick-dangerous-1989-core-design[cr][t].st',        image: 'rick-dangerous-1989-core-design' },
    { label: 'Saint Dragon',             file: 'saint-dragon-1990-sales-curve[cr][t].st',          image: 'saint-dragon-1990-sales-curve' },
    { label: 'Sensible Soccer - disk 1', file: 'sensible-soccer-1992-renegade-disk1[cr].st',       image: 'sensible-soccer-1992-renegade' },
    { label: 'Sensible Soccer - disk 2', file: 'sensible-soccer-1992-renegade-disk2[cr].st',       image: 'sensible-soccer-1992-renegade' },
    { label: 'Speedball 2',              file: 'speedball-2-1990-image-works[cr].st',              image: 'speedball-2-1990-image-works' },
    { label: 'Stunt Car Racer',          file: 'stunt-car-racer-1989-microstyle[cr].st',           image: 'stunt-car-racer-1989-microstyle' },
    // { label: 'Super Cars II',            file: 'super-cars-ii-1991-gremlin[cr].st',                image: 'super-cars-ii-1991-gremlin' },
    { label: 'Toki',                     file: 'toki-1991-ocean[cr][t].st',                        image: 'toki-1991-ocean' },
    { label: 'Turrican II',              file: 'turrican-ii-1991-rainbow-arts[cr][t].st',          image: 'turrican-ii-1991-rainbow-arts' },
    { label: 'Vroom',                    file: 'vroom-1991-lankhor.st',                            image: 'vroom-1991-lankhor' },
  ];
}
