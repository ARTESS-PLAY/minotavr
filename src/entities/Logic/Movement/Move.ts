import { Entity } from '../../Entity';
import { Component } from '../Component';

export class Move extends Component {
    public isMoving: boolean; // передвигается ли сейчас персонаж
    public speed: number;

    constructor(obj: Entity) {
        super('move', obj);

        this.isMoving = false;
        this.speed = 0;
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
