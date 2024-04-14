import { Player } from './../../entities/Player/Player';
import { LAYERS, SIZES, SPRITES, TILES } from '../../utils/constants';
import labyrinthJsonMap from './labyrinth_map.json';

export class Labyrinth extends Phaser.Scene {
    private player?: Player;

    constructor() {
        super('LabyrinthScene');
    }

    preload() {
        this.load.image(TILES.LABYRINTH, 'src/scenes/Labyrinth/labyrinth_tiles.png');
        this.load.tilemapTiledJSON('labyrinth_map', 'src/scenes/Labyrinth/labyrinth_map.json');
        this.load.spritesheet(SPRITES.PLAYER, 'src/entities/Player/sprite.png', {
            frameWidth: SIZES.PLAYER.WIDTH,
            frameHeight: SIZES.PLAYER.HEIGTH,
        });
    }

    create() {
        //создаём карту
        const map = this.make.tilemap({ key: 'labyrinth_map' });
        const tileset = map.addTilesetImage(
            labyrinthJsonMap.tilesets[0].name,
            TILES.LABYRINTH,
            SIZES.TILE.WIDTH,
            SIZES.TILE.HEIGTH,
        );

        //проверка на то, получилось ли добавить карту
        if (tileset) {
            const ground = map.createLayer(LAYERS.GROUNG, tileset, 0, 0);
            const walls = map.createLayer(LAYERS.WALLS, tileset, 0, 0);
        } else {
            throw new Error('Tileset is NULL');
        }

        //создаём игрока
        this.player = new Player(this, 600, 300, SPRITES.PLAYER);
    }

    update(_: number, delta: number): void {
        if (!this.player) throw new Error('Player is not definded');

        this.player.update(delta);
    }
}
