import { Entity } from '../../Entity';
import { Component } from '../Component';

/**
 * Компонент позваляет задать базовое передвижение сущности
 */
export class Move extends Component {
    // Движение вверх
    public isGoUp: boolean = false;

    // Движение вниз
    public isGoDown: boolean = false;

    // Движение влево
    public isGoLeft: boolean = false;

    // Движение вправо
    public isGoRight: boolean = false;

    // Бежит ли сейчас
    public isGoRunnig: boolean = false;

    // Передвигается ли сейчас персонаж
    public isMoving: boolean = false;

    // Скорость персонажа
    public speed: number = 0;

    // Коэфициент скорости
    public speedKoef: number = 10;

    // Коэфициент скорости Бега
    public speedRunKoef: number = 2;

    // Макимальная выносливость
    public maxStamina: number = Infinity;

    // текущая выносливость
    public stamina: number = Infinity;

    constructor(obj: Entity) {
        super('move', obj);
    }

    public _toTop(delta: number) {
        this.entity.setVelocityY(-delta);
    }

    public _toBottom(delta: number) {
        this.entity.setVelocityY(delta);
    }
    public _toLeft(delta: number) {
        this.entity.setVelocityX(-delta);
    }

    public _toRigth(delta: number) {
        this.entity.setVelocityX(delta);
    }
}
