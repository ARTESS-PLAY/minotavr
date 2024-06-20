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
        let scale = Math.max(scaleX, scaleY);
        bg.setScale(scale).setScrollFactor(0);
        bg.setOrigin(0, 0);

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
