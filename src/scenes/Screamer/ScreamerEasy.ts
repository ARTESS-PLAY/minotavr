export class ScreamerEasy extends Phaser.Scene {
    constructor() {
        super('ScreamerEasy');
    }

    preload() {
        // Картинки скримеров
        this.load.image('gostScream1', 'assets/entities/Gost/screamers/1.jfif');
        this.load.image('gostScream2', 'assets/entities/Gost/screamers/2.jpg');
        this.load.image('gostScream3', 'assets/entities/Gost/screamers/3.jpg');
        this.load.image('gostScream4', 'assets/entities/Gost/screamers/4.jpg');

        // Звуки скримеров
        this.load.audio('screamAudio1', 'assets/entities/Gost/sounds/screamAudio1.mp3');
        this.load.audio('screamAudio2', 'assets/entities/Gost/sounds/screamAudio2.mp3');
        this.load.audio('screamAudio3', 'assets/entities/Gost/sounds/screamAudio3.mp3');
        this.load.audio('screamAudio4', 'assets/entities/Gost/sounds/screamAudio4.mp3');
    }

    create({ sreamImgKey, screamSoundKey }: { sreamImgKey: string; screamSoundKey: string }) {
        const bg = this.add.image(0, 0, sreamImgKey);

        let scaleX = this.cameras.main.width / bg.width;
        let scaleY = this.cameras.main.height / bg.height;
        bg.x = this.cameras.main.width / 2;
        bg.setScale(scaleX, scaleY);
        bg.setOrigin(0.5, 0);
        bg.alpha = 0.4;
        bg.setInteractive();

        const audio = this.sound.add(screamSoundKey);

        audio.play();

        this.time.addEvent({
            delay: 2000,
            callback: () => {
                this.scene.stop(this);
                audio.stop();
            },
        });
    }
}
