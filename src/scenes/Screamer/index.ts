export class Screamer extends Phaser.Scene {
    constructor() {
        super('ScreamerScene');
    }

    preload() {
        this.load.audio('scream', 'src/scenes/Screamer/assets/sounds/screamer.mp3');
        this.load.image('screamBG', 'src/scenes/Screamer/assets/images/bg.avif');
    }

    create() {
        const bg = this.add.image(0, 0, 'screamBG');
        let scaleX = this.cameras.main.width / bg.width;
        let scaleY = this.cameras.main.height / bg.height;
        let scale = Math.max(scaleX, scaleY);
        bg.setScale(scale).setScrollFactor(0);
        bg.setOrigin(0, 0);

        const audio = this.sound.add('scream');

        audio.play();

        this.time.addEvent({
            delay: 5000,
            callback: () => {
                this.scene.stop(this);
                this.scene.start('SceneHub');
            },
        });
    }
}
