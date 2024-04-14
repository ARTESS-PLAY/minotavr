import { LAYERS, SIZES, TILES } from '../../utils/constants';
import labyrinthJsonMap from './labyrinth_map.json';

export class Labyrinth extends Phaser.Scene {
    constructor() {
        super('LabyrinthScene');
    }

    preload() {
        this.load.image(TILES.LABYRINTH, 'src/scenes/Labyrinth/labyrinth_tiles.png');
        this.load.tilemapTiledJSON('labyrinth_map', 'src/scenes/Labyrinth/labyrinth_map.json');
    }

    create() {
        const map = this.make.tilemap({ key: 'labyrinth_map' });
        const tileset = map.addTilesetImage(
            labyrinthJsonMap.tilesets[0].name,
            TILES.LABYRINTH,
            SIZES.TILE.WIDTH,
            SIZES.TILE.HEIGTH,
        );
        if (tileset) {
            const ground = map.createLayer(LAYERS.GROUNG, tileset, 0, 0);
            const walls = map.createLayer(LAYERS.WALLS, tileset, 0, 0);
        } else {
            throw new Error('Tileset is NULL');
        }
    }
}
