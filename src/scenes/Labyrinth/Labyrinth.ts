import { Player } from './../../entities/Player/Player';
import {
    GOST_SCREAMERS,
    LAYERS,
    MAX_GHOST,
    SIZES,
    SPRITES,
    TILES,
    TilesIndexes,
} from '../../utils/constants';
import { MAP_IMAGE_SERVER_JSON_URL, getMapFromServer } from '../../api/server';
import { LabyrinthPipelines } from './LabyrinthPipelines';
import { LabyrinthUI } from './LabyrinthUI';
import { Minotavr } from '../../entities/Minotavr/Minotavr';
import { CanScream } from '../../entities/Logic/Enemies/CanScream';
import { HeartBeat } from '../../entities/Logic/Sound/HeartBeat';
import { Gost } from '../../entities/Gost/Gost';
import { SimpleLightShader } from '../../systems/lighting/SimpleLightShader';
import { randomInteger } from '../../utils/numbers';

export class Labyrinth extends Phaser.Scene {
    public player?: Player;
    public minotavr?: Minotavr;
    public layers: Array<Phaser.Tilemaps.TilemapLayer | null>;
    public map?: Phaser.Tilemaps.Tilemap;
    private t: number;
    private tIncrement: number;

    private pipelines: LabyrinthPipelines;
    private triggerTimer: Phaser.Time.TimerEvent | null = null;

    public gosts: Array<Gost> = [];

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
            this.load.tilemapTiledJSON('labyrinth_map', data.json);
        };

        loadMap();
        this.load.image(TILES.LABYRINTH, MAP_IMAGE_SERVER_JSON_URL);
        this.load.spritesheet(SPRITES.PLAYER, 'assets/entities/Player/sprite.png', {
            frameWidth: SIZES.PLAYER.WIDTH,
            frameHeight: SIZES.PLAYER.HEIGTH,
        });
        this.load.spritesheet(SPRITES.MINOTAVR, 'assets/entities/Minotavr/sprite.png', {
            frameWidth: SIZES.MINOTAVR.WIDTH,
            frameHeight: SIZES.MINOTAVR.HEIGTH,
        });
        this.load.spritesheet(SPRITES.GOST, 'assets/entities/Gost/sprite.png', {
            frameWidth: SIZES.GOST.WIDTH,
            frameHeight: SIZES.GOST.HEIGTH,
        });

        this.load.audio('main-theme', 'assets/scenes/Labyrinth/sounds/main-theme.mp3');
        this.load.audio('man-walk', 'assets/entities/Player/sounds/main-walk.mp3');
        this.load.audio('minotavr-walk', 'assets/entities/Minotavr/sounds/walk.mp3');
        this.load.audio('man-run', 'assets/entities/Player/sounds/man-run.mp3');
        this.load.audio('gost-walk', 'assets/entities/Gost/sounds/walk.mp3');
        this.load.audio('heart', 'assets/entities/Player/sounds/heart.mp3');

        // Реплики минотавра
        this.load.audio('replic1', 'assets/entities/Minotavr/sounds/replics/brawl.mp3');
        this.load.audio('replic2', 'assets/entities/Minotavr/sounds/replics/dnd.mp3');
        this.load.audio('replic3', 'assets/entities/Minotavr/sounds/replics/muuuu.mp3');
        this.load.audio('replic4', 'assets/entities/Minotavr/sounds/replics/nasheeeel.mp3');
        this.load.audio('replic5', 'assets/entities/Minotavr/sounds/replics/pivo.mp3');
        this.load.audio('replic6', 'assets/entities/Minotavr/sounds/replics/popalsya.mp3');
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

        const start = ground.findByIndex(TilesIndexes.START);

        //создаём игрока
        this.player = new Player(
            this,
            start.pixelX + start.width / 2,
            start.pixelY,
            SPRITES.PLAYER,
        );

        const exitTiled = exit.findByIndex(TilesIndexes.EXIT);

        //создаём Минтавра
        this.minotavr = new Minotavr(
            this,
            exitTiled.pixelX + exitTiled.width / 2,
            exitTiled.pixelY,
            SPRITES.MINOTAVR,
        );

        //Добавляем цель для биения сердца
        (this.player.getComponent('heartBeat') as HeartBeat).setTarget(this.minotavr);

        //Глубина
        this.player.depth = 1000;
        this.minotavr.depth = 1000;
        walls.depth = 1001;
        exit.depth = 1;

        //работа с камерой
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.pipelines.enablePipilines();

        this.lights.enable();

        //работа с физикой
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        // Добавляем столкновения
        this.player.setCollideWorldBounds(true);
        this.minotavr.setCollideWorldBounds(true);

        this.physics.add.collider(this.player, walls);
        this.physics.add.collider(this.minotavr, walls);

        // Выход из лабиринта
        this.physics.add.overlap(
            this.player,
            exit,
            this.exitLabytinth,
            this.checkIsPlayerOnExit,
            this,
        );

        // Поражение
        this.physics.add.overlap(this.player, this.minotavr, this.minotavrGetPlayer);

        walls.setCollisionByExclusion([-1]);

        const soundTheme = this.sound.add('main-theme');
        soundTheme.loop = true;
        soundTheme.volume = 0.1;
        soundTheme.play();

        this.events.on('shutdown', this.shutdown, this);

        // Запускаем UI
        this.scene.launch('SceneLabyrinthUI');

        // Запускаем генерацию призраков
        this.triggerTimer = this.time.addEvent({
            callback: this.generateRandomGhost,
            callbackScope: this,
            delay: GOST_SCREAMERS.TIME_GENERATE,
            loop: true,
        });
    }

    public update(_: number, delta: number): void {
        if (!this.player) throw new Error('Player is not definded');
        if (!this.minotavr) throw new Error('Minotavr is not definded');

        this.t += this.tIncrement;
        this.player.update(delta);
        this.minotavr.update(delta);

        this.pipelines.updatePipelines();

        // Обновляем призраков
        this.gosts.map((el) => el.update(delta));

        const { context } = this.game.sound as Phaser.Sound.WebAudioSoundManager;
        if (context.state === 'suspended') {
            context.resume();
        }
    }

    /**
     * Срабатывает в момент выключения сцены
     */
    public shutdown() {
        // Отключаем пайпланый
        this.pipelines.shutdownPipelines();
        this.scene.stop('SceneLabyrinthUI');
        this.sound.stopAll();
        this.triggerTimer?.destroy();
    }

    /**
     * Обработчик собития при наступлении на финиш
     */

    public checkIsPlayerOnExit(
        _: any,
        tiled: Phaser.Tilemaps.Tile | Phaser.Types.Physics.Arcade.GameObjectWithBody,
    ) {
        const tile = tiled as Phaser.Tilemaps.Tile;

        if (tile.index == 29) {
            return true;
        }
    }

    /**
     * Позволяет выйти из лабиринта
     */
    private exitLabytinth() {
        this.scene.stop();
        this.sound.stopAll();

        // Получаем за сколько прошли лабиринт
        const UI = this.scene.get('SceneLabyrinthUI') as LabyrinthUI;
        const timverValue = UI.getTimerValue();

        this.scene.start('SceneWin', { timverValue });
    }

    /**
     * Срабатывает когда минотавр догнал игрока
     */
    private minotavrGetPlayer(_: unknown, minotavr: unknown) {
        const sream = (minotavr as Minotavr).getComponent('canScream');
        if (!sream) throw new Error('У минотавра нет скримера');

        (minotavr as Minotavr).scene.scene.stop();
        (minotavr as Minotavr).scene.sound.stopAll();
        (sream as CanScream).sream();
    }

    /**
     * Срабатывает когда минотавр догнал игрока
     */
    private gostGetPlayer(_: unknown, gost: unknown) {
        const currentGost = gost as Gost;
        const sream = currentGost.getComponent('canScream');
        if (!sream) throw new Error('У призрака нет скримера');

        (sream as CanScream).sreamParalel();

        const scene = currentGost.scene as Labyrinth;

        scene.gosts = scene.gosts.filter((g) => g != currentGost);

        currentGost.delete();
        currentGost.destroy();
    }

    /**
     * Появляет призрака в случайной точке на карте
     */
    generateRandomGhost() {
        if (!this.map) return;

        if (this.gosts.length >= MAX_GHOST) return;

        const randomX = randomInteger(0, this.map.widthInPixels);
        const randomY = randomInteger(0, this.map.heightInPixels);

        const gost = new Gost(this, randomX, randomY, SPRITES.GOST);
        gost.depth = 2001;

        const renderer = this.renderer as Phaser.Renderer.WebGL.WebGLRenderer;

        let pipeline = renderer.pipelines.get(`gost-light`) as SimpleLightShader;

        pipeline?.init(this, gost);

        this.gosts.push(gost);

        if (!this.player || !this.minotavr) return;

        // Скример от призрака
        this.physics.add.overlap(this.player, gost, this.gostGetPlayer);
    }
}
