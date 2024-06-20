import { Player } from './../../entities/Player/Player';
import { LAYERS, SIZES, SPRITES, TILES } from '../../utils/constants';
import { MAP_IMAGE_SERVER_JSON_URL, getMapFromServer } from '../../api/server';
import { LabyrinthPipelines } from './LabyrinthPipelines';

export class Labyrinth extends Phaser.Scene {
    public player?: Player;
    public layers: Array<Phaser.Tilemaps.TilemapLayer | null>;
    private map?: Phaser.Tilemaps.Tilemap;
    private smallCamera?: Phaser.Cameras.Scene2D.Camera;
    private t: number;
    private tIncrement: number;
    private startIndex: number = 0;

    private pipelines: LabyrinthPipelines;

    constructor() {
        super('SceneLabyrinth');
        this.layers = [];
        this.t = 0;
        this.tIncrement = 0.005;
        this.pipelines = new LabyrinthPipelines(this);
    }

    preload() {
        const loadMap = async () => {
            const data = await getMapFromServer();
            this.startIndex = data.startIndex;
            this.load.tilemapTiledJSON('labyrinth_map', data.json);
        };

        loadMap();
        this.load.image(TILES.LABYRINTH, MAP_IMAGE_SERVER_JSON_URL);
        this.load.spritesheet(SPRITES.PLAYER, 'assets/entities/Player/sprite.png', {
            frameWidth: SIZES.PLAYER.WIDTH,
            frameHeight: SIZES.PLAYER.HEIGTH,
        });

        this.load.audio('main-theme', 'assets/scenes/Labyrinth/sounds/main-theme.mp3');
        this.load.audio('man-walk', 'assets/entities/Player/sounds/main-walk.mp3');
        this.load.audio('man-run', 'assets/entities/Player/sounds/man-run.mp3');
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
        const exit = this.map.createLayer(LAYERS.EXIT, tileset, 0, 0);

        if (!walls || !ground || !exit) throw new Error('Layers don`t create');

        this.layers.push(ground);
        this.layers.push(walls);
        this.layers.push(exit);

        const start = ground.findByIndex(23);

        //создаём игрока
        this.player = new Player(
            this,
            start.pixelX + start.width / 2,
            start.pixelY,
            SPRITES.PLAYER,
        );

        //работа с камерой
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

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

        this.pipelines.enablePipilines();

        this.lights.enable();

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
        this.pipelines.updatePipelines();

        const { context } = this.game.sound as Phaser.Sound.WebAudioSoundManager;
        if (context.state === 'suspended') {
            context.resume();
        }
    }
}
