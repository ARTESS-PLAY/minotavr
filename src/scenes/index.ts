import { Defeat } from './Defeat/Defeat';
import { Hub } from './Hub/Hub';
import { Labyrinth } from './Labyrinth/Labyrinth';
import { LabyrinthUI } from './Labyrinth/LabyrinthUI';
import { Novella } from './Novella/Novella';
import { Screamer } from './Screamer/Screamer';
import { Win } from './Win/Win';

/**
 * Индексный файл в котором хранятся все сцены
 */

export const SCENES = [Labyrinth, Hub, Novella, Win, Screamer, LabyrinthUI, Defeat];
