import { Player } from './../../entities/Player/Player';
import { LAYERS, SIZES, SPRITES, TILES } from '../../utils/constants';
import labyrinthJsonMap from './assets/labyrinth_map.json';
import { SimpleLightShader } from '../../systems/lighting/SimpleLightShader';

const pipelines = [SimpleLightShader];

export class Labyrinth extends Phaser.Scene {
    private player?: Player;
    private layers: Array<Phaser.Tilemaps.TilemapLayer | null>;
    private map?: Phaser.Tilemaps.Tilemap;
    private smallCamera?: Phaser.Cameras.Scene2D.Camera;
    private t: number;
    private tIncrement: number;

    private pipelines: Phaser.Renderer.WebGL.WebGLPipeline[];

    constructor() {
        super('LabyrinthScene');
        this.layers = [];
        this.t = 0;
        this.tIncrement = 0.005;
        this.pipelines = [];
    }

    preload() {
        this.load.image(TILES.LABYRINTH, 'src/scenes/Labyrinth/assets/labyrinth_tiles.png');
        this.load.tilemapTiledJSON(
            'labyrinth_map',
            'src/scenes/Labyrinth/assets/labyrinth_map.json',
        );
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
        this.cameras.main.ignore([this.physics.world.debugGraphic]);

        //добавляем камеру для эффектов

        this.smallCamera = this.cameras.add(
            0,
            0,
            this.cameras.main.width,
            this.cameras.main.height,
        );
        this.smallCamera.startFollow(this.player);
        this.smallCamera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.smallCamera.ignore([ground, walls, this.player]);

        // const smallCamera = this.cameras.add(0, 0, this.map.widthInPixels, 200);
        // smallCamera.startFollow(this.player);
        // smallCamera.setPosition(this.cameras.main.x, this.cameras.main.y);
        // smallCamera.setScroll(this.cameras.main.scrollX, this.cameras.main.scrollY);

        this.cameras.main.ignore(this.physics.world.debugGraphic);
        this.player.depth = this.player.y + this.player.height / 2;
        walls.depth = walls.y + walls.height / 2;

        //работа со светом
        // walls.setPipeline('Light2D');
        // ground.setPipeline('Light2D');

        this.lights.enable();

        //работа с пайплайнами
        pipelines.forEach((pipeline) => {
            (this.renderer as Phaser.Renderer.WebGL.WebGLRenderer).pipelines.addPostPipeline(
                pipeline.name,
                pipeline,
            );

            const testPiplane = (
                this.renderer as Phaser.Renderer.WebGL.WebGLRenderer
            ).pipelines.add(pipeline.name, new pipeline(this.game));

            testPiplane.set1f('tx', 400);
            testPiplane.set1f('ty', 400);
            testPiplane.set1f('r', 50);
            testPiplane.set2f('resolution', 1.9, 1.0);

            // this.cameras.main.setPostPipeline(pipeline);
            walls.setPipeline(testPiplane);
            ground.setPipeline(testPiplane);
            // smallCamera.setPostPipeline(pipeline);

            this.pipelines.push(testPiplane);
        });

        //работа с физикой
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.player.setCollideWorldBounds(true);

        this.physics.add.collider(this.player, walls);
        walls.setCollisionByExclusion([-1]);
    }

    update(_: number, delta: number): void {
        if (!this.player) throw new Error('Player is not definded');
        this.t += this.tIncrement;
        this.player.update(delta);

        this.pipelines[0].set1f('time', this.t);
    }
}
