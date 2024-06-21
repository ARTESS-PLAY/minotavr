export class Screamer extends Phaser.Scene {
    constructor() {
        super('ScreamerScene');
    }

    preload() {
        this.load.audio('scream', 'assets/scenes/Screamer/sounds/screamer.mp3');
        this.load.image('screamBG', 'assets/scenes/Screamer/images/bg.avif');
    }

    create({ sreamImgKey, screamSoundKey }: { sreamImgKey: string; screamSoundKey: string }) {
        const bg = this.add.image(0, 0, sreamImgKey);

        let scaleX = this.cameras.main.width / bg.width;
        let scaleY = this.cameras.main.height / bg.height;
        bg.x = this.cameras.main.width / 2;
        bg.setScale(scaleX, scaleY);
        bg.setOrigin(0.5, 0);
        bg.setInteractive();

        const audio = this.sound.add(screamSoundKey);

        audio.play();

        this.time.addEvent({
            delay: 5000,
            callback: () => {
                this.scene.stop(this);
                this.scene.start('SceneDefeat');
            },
        });
    }
}
