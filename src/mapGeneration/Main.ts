import { MazeGenerator } from './utils/MazeGenerator.js';
import * as PATH_TO_JSON_MAP from './assets/map/map.json';
import fs from 'fs'; 
const MAX_WEIGHT = 1000;
// const PATH_TO_JSON_MAP = './assets/map/map.json';
//задаёт размер карты (в количестве комнат на одну сторону)
const GRID_SIZE = 11;

//23 - start, 29 - finish

//всё в тестовом режиме, если нужен метод для обращения, который отдаёт что то а-ля "сервер"
//пиши сам, пока он просто меняет Json, можешь просто вызывать нижеописанные и обращаться напрямую к json`у после этого

//генерит новую карту
const mg = new MazeGenerator(GRID_SIZE, MAX_WEIGHT);
const jsonData = PATH_TO_JSON_MAP;
const result = mg.generateMap(jsonData);
//переписывает json файл с новой картой
//fs.writeFileSync('src/mapGeneration/assets/map/test.json', JSON.stringify(result.json, null, 2));

export function generateJsonMap(size: number) {
    const mg = new MazeGenerator(size, MAX_WEIGHT);
    const jsonData = PATH_TO_JSON_MAP;
    return mg.generateMap(jsonData);
}
