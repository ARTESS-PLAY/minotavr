/**
 * Класс отвечает за работу UI интерфейса внутри лабиринта
 */

import { ProgressBar } from '../../UI/Progress';
import { Move } from '../../entities/Logic/Movement/Move';
import { getCuteTime } from '../../utils/numbers';
import { Labyrinth } from './Labyrinth';

export class LabyrinthUI extends Phaser.Scene {
    // Переменная будет хранить ссылку на текст таймера
    private timerText: Phaser.GameObjects.Text | null = null;

    // Секунды прошедшие с начала забега
    private timerValue = 0;

    private progressBar: ProgressBar | null = null;

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

        this.progressBar = new ProgressBar(this, 10, 10, 100, 20);
    }

    update(time: number): void {
        const player = (this.scene.get('SceneLabyrinth') as Labyrinth).player;

        if (!player) throw new Error('Игрок не определён');

        const move = player.getComponent('move') as Move;

        if (this.progressBar) this.progressBar.setProgress(move.stamina / move.maxStamina);

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
