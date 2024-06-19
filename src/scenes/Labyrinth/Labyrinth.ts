import { Player } from './../../entities/Player/Player';
import { LAYERS, SIZES, SPRITES, TILES } from '../../utils/constants';
//@ts-ignore
import labyrinthJsonMap from './assets/labyrinth_map.json';
import { SimpleLightShader } from '../../systems/lighting/SimpleLightShader';
import { getCanvasPoint } from '../../utils/camera';

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
        super('SceneLabyrinth');
        this.layers = [];
        this.t = 0;
        this.tIncrement = 0.005;
        this.pipelines = [];
    }

    preload() {
        this.load.image(TILES.LABYRINTH, 'http://95.163.223.110:3005/map/durotar.jpg');
        this.load.tilemapTiledJSON('labyrinth_map', 'http://95.163.223.110:3005/map/map.json');
        this.load.spritesheet(SPRITES.PLAYER, 'src/entities/Player/sprite.png', {
            frameWidth: SIZES.PLAYER.WIDTH,
            frameHeight: SIZES.PLAYER.HEIGTH,
        });

        this.load.audio('main-theme', 'src/scenes/Labyrinth/assets/sounds/main-theme.mp3');
        this.load.audio('man-walk', 'src/entities/Player/assets/sounds/main-walk.mp3');
        this.load.audio('man-run', 'src/entities/Player/assets/sounds/man-run.mp3');
    }

    create() {
        //создаём карту
        this.map = this.make.tilemap({ key: 'labyrinth_map' });
        const tileset = this.map.addTilesetImage(
            'tiles',
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
            const testPiplane = (
                this.renderer as Phaser.Renderer.WebGL.WebGLRenderer
            ).pipelines.add(pipeline.name, new pipeline(this.game));

            testPiplane.set1f('tx', 0);
            testPiplane.set1f('ty', 0);
            testPiplane.set1f('r', 1);
            testPiplane.set2f('resolution', 1.4, 1.4);

            walls.setPipeline(testPiplane);
            ground.setPipeline(testPiplane);

            this.pipelines.push(testPiplane);
        });

        //работа с физикой
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.player.setCollideWorldBounds(true);

        this.physics.add.collider(this.player, walls);
        walls.setCollisionByExclusion([-1]);

        const soundTheme = this.sound.add('main-theme');
        soundTheme.loop = true;
        soundTheme.volume = 0.1;
        soundTheme.play();

        // this.time.addEvent({
        //     delay: 15000,
        //     callback: () => {
        //         console.log(this);

        //         this.scene.stop(this);
        //         this.scene.start('ScreamerScene');
        //     },
        // });
    }

    update(_: number, delta: number): void {
        if (!this.player) throw new Error('Player is not definded');
        this.t += this.tIncrement;
        this.player.update(delta);

        this.pipelines.forEach((pipeline) => {
            if (!this.player) return;

            if (pipeline.name == 'SimpleLightShader') {
                const playerCurve = this.player as unknown as Phaser.GameObjects.Curve;
                const { x, y } = getCanvasPoint(this, this.cameras.main, playerCurve);

                pipeline.set1f('tx', x);
                pipeline.set1f('ty', Number(this.game.config.height) - y);
            }
        });

        const { context } = this.game.sound as Phaser.Sound.WebAudioSoundManager;
        if (context.state === 'suspended') {
            context.resume();
        }
    }
}
