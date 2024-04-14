import { SPRITES } from '../../utils/constants';
import { Entity } from '../Entity';

/**
 * Класс отвечает за логику работы игрока
 */

export class Player extends Entity {
    private textureKey: string;
    private isMoving: boolean; // передвигается ли сейчас персонаж

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture, SPRITES.PLAYER);

        const anims = this.scene.anims;
        const animsFrameRate = 16;

        this.textureKey = texture;
        this.isMoving = false;

        anims.create({
            key: 'up',
            frames: anims.generateFrameNumbers(this.textureKey, {
                start: 0,
                end: 8,
            }),
            frameRate: animsFrameRate,
            repeat: -1,
        });

        anims.create({
            key: 'left',
            frames: anims.generateFrameNumbers(this.textureKey, {
                start: 9,
                end: 17,
            }),
            frameRate: animsFrameRate,
            repeat: -1,
        });

        anims.create({
            key: 'down',
            frames: anims.generateFrameNumbers(this.textureKey, {
                start: 18,
                end: 26,
            }),
            frameRate: animsFrameRate,
            repeat: -1,
        });

        anims.create({
            key: 'rigth',
            frames: anims.generateFrameNumbers(this.textureKey, {
                start: 27,
                end: 35,
            }),
            frameRate: animsFrameRate,
            repeat: -1,
        });
    }

    update(delta: number): void {
        //прослушиватели событий
        const keys = this.scene.input.keyboard?.createCursorKeys();

        if (!keys) throw new Error('Keyboard is not definted');

        //логика по работе с движением
        const move = delta * 0.15;

        this.isMoving = false;
        //также надо обработать случай движения наискосок
        const isHorizontalMove = keys.left.isDown || keys.right.isDown;
        const isVerticallMove = keys.up.isDown || keys.down.isDown;
        const isDiagonallyMove = isHorizontalMove && isVerticallMove;

        if (isDiagonallyMove) {
            this.isMoving = true;

            if (keys.up.isDown) {
                this._toTop(move * 0.7);
            }
            if (keys.down.isDown) {
                this._toBottom(move * 0.7);
            }
            if (keys.left.isDown) {
                this.play('left', true);
                this._toLeft(move * 0.75);
            }
            if (keys.right.isDown) {
                this.play('rigth', true);
                this._toRigth(move * 0.75);
            }
        } else {
            if (keys.up.isDown) {
                this.play('up', true);
                this._toTop(move);
                this.isMoving = true;
            }
            if (keys.down.isDown) {
                this.play('down', true);
                this._toBottom(move);
                this.isMoving = true;
            }
            if (keys.left.isDown) {
                this.play('left', true);
                this._toLeft(move);
                this.isMoving = true;
            }
            if (keys.right.isDown) {
                this.play('rigth', true);
                this._toRigth(move);
                this.isMoving = true;
            }
        }

        if (!this.isMoving) {
            this.stop();
        }
    }

    private _toTop(delta: number) {
        this.setPosition(this.x, (this.y -= delta));
    }

    private _toBottom(delta: number) {
        this.setPosition(this.x, (this.y += delta));
    }

    private _toLeft(delta: number) {
        this.setPosition(this.x - delta, this.y);
    }

    private _toRigth(delta: number) {
        this.setPosition(this.x + delta, this.y);
    }
}
