import { Defeat } from './Defeat/Defeat';
import { Hub } from './Hub/Hub';
import { Labyrinth } from './Labyrinth/Labyrinth';
import { LabyrinthUI } from './Labyrinth/LabyrinthUI';
import { Novella } from './Novella/Novella';
import { Screamer } from './Screamer/Screamer';
import { ScreamerEasy } from './Screamer/ScreamerEasy';
import { Win } from './Win/Win';

/**
 * Индексный файл в котором хранятся все сцены
 */

export const SCENES = [Hub, Labyrinth, ScreamerEasy, Novella, Win, Screamer, LabyrinthUI, Defeat];
