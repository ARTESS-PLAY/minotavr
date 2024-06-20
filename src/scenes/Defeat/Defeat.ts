/**
 * Сцена запускается, когда игрок нашёл выход
 */

import WebFontFile from '../../utils/WebFontFile';

export class Defeat extends Phaser.Scene {
    constructor() {
        super('SceneDefeat');
    }

    preload() {
        this.load.addFile(new WebFontFile(this.load, ['Roboto']));
        this.load.audio('sadDefeat', 'assets/scenes/Defeat/sounds/sad.mp3');
    }

    create() {
        // Звук радости при победе
        const sadSound = this.sound.add('sadDefeat');
        sadSound.play();

        const textX = Number(this.game.config.width) / 2;
        const textY = Number(this.game.config.height) / 3;

        const text = this.add.text(textX, textY, 'Вас Сожрали :(', {
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
                sadSound.stop();
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
