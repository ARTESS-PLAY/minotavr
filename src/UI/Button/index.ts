/* Кастомное решение для создания кнопки */

export class Button extends Phaser.GameObjects.Graphics {
    public text?: Phaser.GameObjects.Text;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        width: number,
        height: number,
        fillColor?: number | undefined,
    ) {
        let color = fillColor;
        // Если цвет не задан
        if (!color) {
            color = 0xff0000;
        }

        // // Вызываем родительский конструктор
        super(scene, { x, y });

        this.fillStyle(color, 1);

        const btnX = 0 - width / 2;
        const btnY = 0 - height / 2;

        this.fillRoundedRect(btnX, btnY, width, height, 32);

        const hitpoly = new Phaser.Geom.Polygon([
            btnX,
            btnY,
            btnX + width,
            btnY,
            btnX + width,
            btnY + height,
            btnX,
            btnY + height,
        ]);

        // // Делаем интерактивной
        this.setInteractive({
            hitArea: hitpoly,
            useHandCursor: true,
            hitAreaCallback: Phaser.Geom.Polygon.Contains,
        });

        // // Добавляем на сцену
        this.scene.add.existing(this);
    }

    setText(text: string) {
        if (this.text) {
            this.text.destroy();
        }

        this.text = this.scene.add.text(this.x, this.y, text, {
            fontFamily: 'Roboto',
            fontSize: 48,
            fontStyle: 'bold',
            color: '#ffffff',
            align: 'center',
        });

        this.text?.setOrigin(0.5);
    }

    setFontFamily(ff: string) {
        if (!this.text) return;

        this.text.setFontFamily(ff);
    }
}
