/**
 * Компонент отвечает за передвижение персонажа
 *
 * ЗАВИСИМОСТЬ: MOVE
 */

import { Entity } from '../../Entity';
import { Component } from '../Component';
import { Move } from './Move';

export class MoveController extends Component {
    // Пытается ли персонаж двигаться по горизонтали
    public isHorizontalMove: boolean = false;

    // Пытается ли персонаж двигаться по вертикали
    public isVerticalMove: boolean = false;

    // Пытается ли персонаж двигаться по диагнонали
    public isDiagonallyMove: boolean = false;

    // Пытается ли персонаж двигаться в противоположных направлениях впринципе
    public isOppositeMove: boolean = false;

    // Пытается ли персонаж двигаться в противоположных по горизонтали
    public isOppositeMoveHorizontal: boolean = false;

    // Пытается ли персонаж двигаться в противоположных по вертикали
    public isOppositeMoveVertical: boolean = false;

    constructor(obj: Entity) {
        super('moveController', obj);

        const move = obj.getComponent('move');

        if (!move) throw new Error('Компонент MoveContoller зависим от компонента Move');
    }

    public updateMove(delta: number) {
        const entity = this.entity;

        const move = entity.getComponent('move') as Move;

        // Если никакая клавиша не нажата - то и считать дальше смысла нет
        if (!move.isGoUp && !move.isGoDown && !move.isGoLeft && !move.isGoRight) {
            move.isMoving = false;
            move.speed = 0;
            entity.setVelocityY(0);
            entity.setVelocityX(0);
            this.updateStamina(delta);
            return;
        }

        move.speed = delta * move.speedKoef;

        // Пытаемся понять поведение игрока
        this.isHorizontalMove = move.isGoLeft || move.isGoRight;
        this.isVerticalMove = move.isGoUp || move.isGoDown;
        this.isDiagonallyMove = this.isHorizontalMove && this.isVerticalMove;
        this.isOppositeMoveHorizontal = move.isGoLeft && move.isGoRight;
        this.isOppositeMoveVertical = move.isGoUp && move.isGoDown;
        this.isOppositeMove = this.isOppositeMoveHorizontal || this.isOppositeMoveVertical;

        // Сбрасывем скорость
        entity.setVelocityY(0);
        entity.setVelocityX(0);

        // Если не двигаемся, то обрабатывать дальше смысла нет
        if (this.isOppositeMove) {
            move.isMoving = false;

            // Если вертикально - то по игрику не идём
            if (this.isOppositeMoveVertical) {
                entity.setVelocityY(0);
            }

            // Если горизонтально - то не идём по иксу
            if (this.isOppositeMoveHorizontal) {
                entity.setVelocityX(0);
            }

            return;
        }

        // В остальном случае - идём
        move.isMoving = true;

        this.updateStamina(delta);

        move.isGoRunnig = move.isGoRunnig && this.canRun();

        if (move.isGoRunnig) {
            move.speed *= move.speedRunKoef;
            move.stamina = Math.max(0, move.stamina - delta * 0.1);
        }

        // Фича - по горзонтали передвигается быстрее
        if (move.isGoUp) {
            move._toTop(move.speed * (this.isDiagonallyMove ? 0.7 : 1));
        }
        if (move.isGoDown) {
            move._toBottom(move.speed * (this.isDiagonallyMove ? 0.7 : 1));
        }
        if (move.isGoLeft) {
            move._toLeft(move.speed * (this.isDiagonallyMove ? 0.75 : 1));
        }
        if (move.isGoRight) {
            move._toRigth(move.speed * (this.isDiagonallyMove ? 0.75 : 1));
        }
    }

    public canRun() {
        const move = this.entity.getComponent('move') as Move;

        if (!isFinite(move.maxStamina)) return true;

        if (move.stamina > 1) return true;

        return false;
    }

    public updateStamina(delta: number) {
        const move = this.entity.getComponent('move') as Move;

        if (!isFinite(move.maxStamina)) return;

        if (!move.isGoRunnig || !move.isMoving) {
            move.stamina = Math.min(move.maxStamina, move.stamina + delta * 0.05);
        }
    }
}
