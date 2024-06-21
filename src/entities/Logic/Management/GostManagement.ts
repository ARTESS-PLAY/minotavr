import { Labyrinth } from '../../../scenes/Labyrinth/Labyrinth';
import { Entity } from '../../Entity';
import { Component } from '../Component';
import { Move } from '../Movement/Move';

/**
 * Класс отвечает за управление призраком
 *
 * ЗАВИСИМОСТЬ: MOVE
 */
export class GostManagement extends Component {
    constructor(obj: Entity) {
        super('gostManagement', obj);
    }

    /**
     * Устанавливаем все коэфициенты
     */
    enable() {
        // Устанавливаем коэфициенты бега
        const move = this.entity.getComponent('move') as Move;
        move.speedKoef = 2;
        move.speedRunKoef = 1;
    }

    update() {
        const player = (this.entity.scene as Labyrinth).player;

        if (!player) throw new Error('Игрок не найден');

        const playerX = player.x;
        const playerY = player.y;

        const move = this.entity.getComponent('move') as Move;

        // Обновляем его состояния
        move.isGoDown = this.entity.y < playerY;
        move.isGoLeft = !move.isGoDown && this.entity.x > playerX;
        move.isGoRight = this.entity.x < playerX;
        move.isGoUp = !move.isGoDown && this.entity.y > playerY;
    }
}
