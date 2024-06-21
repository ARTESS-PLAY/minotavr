/*
 * Кастомное решение для проекта
 */

export class ProgressBar extends Phaser.GameObjects.Graphics {
    public progress: number = 1;

    private width: number = 0;

    private progressBar: Phaser.GameObjects.Rectangle;

    constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number) {
        // Вызываем родительский конструктор
        super(scene, { x, y });

        this.width = width;

        // Располагаем по середине
        scene.add.rectangle(x, y, width, height, 0x1f1f1f, 1).setOrigin(0, 0);
        this.progressBar = scene.add
            .rectangle(x, y, width * this.progress, height, 0x00e436, 1)
            .setOrigin(0, 0);
    }

    setProgress(p: number) {
        this.progress = p;
        this.progressBar.width = this.width * this.progress;
    }
}
