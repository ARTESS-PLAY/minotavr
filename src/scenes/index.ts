import { Hub } from './Hub/Hub';
import { Labyrinth } from './Labyrinth/Labyrinth';
import { LabyrinthUI } from './Labyrinth/LabyrinthUI';
import { Screamer } from './Screamer';
import { Win } from './Win/Win';

/**
 * Индексный файл в котором хранятся все сцены
 */

export const SCENES = [Labyrinth, Hub, Win, Screamer, LabyrinthUI];
