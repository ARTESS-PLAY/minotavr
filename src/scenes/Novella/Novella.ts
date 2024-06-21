export class Novella extends Phaser.Scene {
    constructor() {
        super('NovellaScene');
    }

    preload() {
        this.load.image('novella1', 'assets/scenes/Novella/novella1.png');
        this.load.image('novella2', 'assets/scenes/Novella/novella2.png');
        this.load.image('novella3', 'assets/scenes/Novella/novella3.png');
        this.load.image('novella4', 'assets/scenes/Novella/novella4.png');
        this.load.image('novella5', 'assets/scenes/Novella/novella5.png');
    }

    create() {
        const novella1 = this.add.image(0, 0, 'novella1');
        this.prepareImage(novella1);
        const novella2 = this.add.image(0, 0, 'novella2').setVisible(false);
        this.prepareImage(novella2);
        const novella3 = this.add.image(0, 0, 'novella3').setVisible(false);
        this.prepareImage(novella3);
        const novella4 = this.add.image(0, 0, 'novella4').setVisible(false);
        this.prepareImage(novella4);
        const novella5 = this.add.image(0, 0, 'novella5').setVisible(false);
        this.prepareImage(novella5);

        novella1.on('pointerdown', async () => {
            novella1.setVisible(false);
            novella2.setVisible(true);
        });

        novella2.on('pointerdown', async () => {
            novella2.setVisible(false);
            novella3.setVisible(true);
        });

        novella3.on('pointerdown', async () => {
            novella3.setVisible(false);
            novella4.setVisible(true);
        });

        novella4.on('pointerdown', async () => {
            novella4.setVisible(false);
            novella5.setVisible(true);
        });

        novella5.on('pointerdown', async () => {
            novella5.setVisible(false);
            this.scene.start('SceneLabyrinth');
            this.scene.stop();
            const audioBg = this.sound.get('theme');
            audioBg.stop();
        });
    }

    prepareImage(image: Phaser.GameObjects.Image) {
        let scaleX = this.cameras.main.width / image.width;
        let scaleY = this.cameras.main.height / image.height;
        image.x = this.cameras.main.width / 2;
        image.setScale(scaleX, scaleY);
        image.setOrigin(0.5, 0);
        image.setInteractive();
    }
}
