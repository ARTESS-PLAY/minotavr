import { Entity } from '../../Entity';
import { Component } from '../Component';
import { Move } from '../Movement/Move';

/**
 * Класс отвечает за управление игроком
 *
 * ЗАВИСИМОСТЬ: MOVE
 */
export class PlayerManagement extends Component {
    constructor(obj: Entity) {
        super('playerManagement', obj);
    }

    update() {
        const keys = this.entity.scene.input.keyboard?.createCursorKeys();
        const entity = this.entity;

        // Зависимость от клавиатуры
        if (!keys) throw new Error('Keyboard is not definted');

        const move = entity.getComponent('move') as Move;

        // Обновляем его состояния
        move.isGoDown = keys.down.isDown;
        move.isGoLeft = keys.left.isDown;
        move.isGoRight = keys.right.isDown;
        move.isGoUp = keys.up.isDown;
        move.isGoRunnig = keys.shift.isDown;
    }
}
