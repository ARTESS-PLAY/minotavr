/**
 * Класс отвечает за работу UI интерфейса внутри лабиринта
 */

import { getCuteTime } from '../../utils/numbers';

export class LabyrinthUI extends Phaser.Scene {
    // Переменная будет хранить ссылку на текст таймера
    private timerText: Phaser.GameObjects.Text | null = null;

    // Секунды прошедшие с начала забега
    private timerValue = 0;

    constructor() {
        super('SceneLabyrinthUI');
    }

    create() {
        // Устанавливаем таймер

        const textX = Number(this.game.config.width) - 20;
        const textY = Number(this.game.config.height) / 12 - 20;

        this.timerText = this.add.text(textX, textY, String(this.timerValue), {
            fontFamily: 'Roboto',
            fontSize: 12,
            color: '#ffffff',
            align: 'right',
        });

        this.timerText.setOrigin(1, 1);
    }

    update(time: number): void {
        this.timerValue = time / 1000;

        this.timerText?.setText(getCuteTime(this.timerValue));
    }

    /**
     * Возвращает значение таймера
     */
    public getTimerValue() {
        return this.timerValue;
    }
}
