import { Entity } from '../../Entity';

export class Move {
    protected isMoving: boolean; // передвигается ли сейчас персонаж
    protected speed: number;
    private obj: Entity;

    constructor(obj: Entity) {
        this.obj = obj;
        this.isMoving = false;
        this.speed = 0;
    }

    private _toTop(delta: number) {
        this.obj.setVelocityY(-delta);
    }

    private _toBottom(delta: number) {
        this.obj.setVelocityY(delta);
    }
    private _toLeft(delta: number) {
        this.obj.setVelocityX(-delta);
    }

    private _toRigth(delta: number) {
        this.obj.setVelocityX(delta);
    }
}
