import { Button } from '../../UI/Button';
import { getMapFromServer } from '../../api/server';
import WebFontFile from '../../utils/WebFontFile';

export class Hub extends Phaser.Scene {
    private background?: Phaser.GameObjects.Sprite;

    constructor() {
        super('SceneHub');
    }

    preload() {
        this.load.audio('theme', 'src/scenes/Hub/assets/sounds/main_bg.mp3');
        this.load.addFile(new WebFontFile(this.load, ['Roboto']));
        this.load.spritesheet('background', 'src/scenes/Hub/assets/images/bg.png', {
            frameWidth: 580,
            frameHeight: 440,
        });
    }

    create() {
        const ws = new WebSocket('wss://95.163.223.110:8080');

        // ws.onopen = () => {
        //     console.log('Соединение установлено');
        //     ws.send('Привет сервер!');
        // };

        // ws.onmessage = (event) => {
        //     console.log(`Сообщение от сервера: ${event.data}`);
        // };

        // ws.onclose = () => {
        //     console.log('Соединение закрыто');
        // };

        ws.onerror = (err) => {
            console.log(err);
        };

        const audioBg = this.sound.add('theme');
        audioBg.loop = true;
        audioBg.play();

        this.anims.create({
            key: 'gameover',
            frames: this.anims.generateFrameNumbers('background', {
                start: 0,
                end: 5,
            }),
            frameRate: 2,
            repeat: 0,
        });

        this.background = this.add.sprite(0, 0, 'gameover');
        this.background.setOrigin(0, 0);

        this.background.displayWidth = 50;
        this.background.displayHeight = 50;

        const buttonX = Number(this.game.config.width) / 2;
        const buttonY = (Number(this.game.config.height) / 6) * 5;

        const btn = new Button(this, buttonX, buttonY, buttonX, 100, 0x1f1f1f);

        btn.setText('Начать!');

        btn.on('pointerdown', async () => {
            btn.setText('Загружаю...');
            const res = await getMapFromServer();
            this.scene.start('SceneLabyrinth');
            audioBg.stop();
        });
    }
    update() {
        this.background?.anims.play('gameover', true);
        const { context } = this.game.sound as Phaser.Sound.WebAudioSoundManager;
        if (context.state === 'suspended') {
            context.resume();
        }
    }
}