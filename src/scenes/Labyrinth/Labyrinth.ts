import { Player } from './../../entities/Player/Player';
import { LAYERS, SIZES, SPRITES, TILES } from '../../utils/constants';
import labyrinthJsonMap from './labyrinth_map.json';

export class Labyrinth extends Phaser.Scene {
    private player?: Player;
    private layers: Array<Phaser.Tilemaps.TilemapLayer | null>;
    private map?: Phaser.Tilemaps.Tilemap;

    constructor() {
        super('LabyrinthScene');
        this.layers = [];
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
        this.map = this.make.tilemap({ key: 'labyrinth_map' });
        const tileset = this.map.addTilesetImage(
            labyrinthJsonMap.tilesets[0].name,
            TILES.LABYRINTH,
            SIZES.TILE.WIDTH,
            SIZES.TILE.HEIGTH,
        );

        //проверка на то, получилось ли добавить карту
        if (!tileset) throw new Error('Tileset is NULL');

        const ground = this.map.createLayer(LAYERS.GROUNG, tileset, 0, 0);
        const walls = this.map.createLayer(LAYERS.WALLS, tileset, 0, 0);

        if (!walls || !ground) throw new Error('Layers don`t create');

        this.layers.push(ground);
        this.layers.push(walls);

        //создаём игрока
        this.player = new Player(this, 600, 300, SPRITES.PLAYER);

        //работа с камерой
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.player.depth = this.player.y + this.player.height / 2;
        walls.depth = walls.y + walls.height / 2;

        //работа с физикой
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.player.setCollideWorldBounds(true);

        this.physics.add.collider(this.player, walls);
        walls.setCollisionByExclusion([-1]);
    }

    update(_: number, delta: number): void {
        if (!this.player) throw new Error('Player is not definded');

        this.player.update(delta);
    }
}
