/**
 * Сцена запускается, когда игрок нашёл выход
 */

import WebFontFile from '../../utils/WebFontFile';

export class Win extends Phaser.Scene {
    constructor() {
        super('SceneWin');
    }

    preload() {
        this.load.addFile(new WebFontFile(this.load, ['Roboto']));
        this.load.audio('happyWin', 'assets/scenes/Win/sounds/happy.mp3');
    }

    create() {
        // Звук радости при победе
        const happySound = this.sound.add('happyWin');
        happySound.play();

        const textX = Number(this.game.config.width) / 2;
        const textY = Number(this.game.config.height) / 3;

        const text = this.add.text(textX, textY, 'Вы спасись от минотавра!', {
            fontFamily: 'Roboto',
            fontSize: 48,
            fontStyle: 'bold',
            color: '#ffffff',
            align: 'center',
        });

        text?.setOrigin(0.5);

        this.time.addEvent({
            delay: 5000,
            callback: () => {
                this.scene.stop(this);
                this.scene.start('SceneHub');
                happySound.stop();
            },
        });
    }

    update() {
        const { context } = this.game.sound as Phaser.Sound.WebAudioSoundManager;
        if (context.state === 'suspended') {
            context.resume();
        }
    }
}
