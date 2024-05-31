import { SPRITES } from '../../utils/constants';
import { Entity } from '../Entity';

/**
 * Класс отвечает за логику работы игрока
 */

export class Player extends Entity {
    private textureKey: string;
    private isMoving: boolean; // передвигается ли сейчас персонаж
    private animsFrameRate: number;
    private speed: number;
    private activeSoundKey?: null | string;

    private _FRAMERATE = {
        SLOW: 16,
        FAST: 32,
    };

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture, SPRITES.PLAYER);

        const anims = this.scene.anims;
        this.animsFrameRate = this._FRAMERATE.SLOW;

        this.textureKey = texture;
        this.isMoving = false;
        this.speed = 0;

        //уменьшаем размеры блока
        this.setSize(24, 30);
        this.setOffset(20, 20);

        anims.create({
            key: 'up',
            frames: anims.generateFrameNumbers(this.textureKey, {
                start: 0,
                end: 8,
            }),
            frameRate: this.animsFrameRate,
            repeat: -1,
        });

        anims.create({
            key: 'left',
            frames: anims.generateFrameNumbers(this.textureKey, {
                start: 9,
                end: 17,
            }),
            frameRate: this.animsFrameRate,
            repeat: -1,
        });

        anims.create({
            key: 'down',
            frames: anims.generateFrameNumbers(this.textureKey, {
                start: 18,
                end: 26,
            }),
            frameRate: this.animsFrameRate,
            repeat: -1,
        });

        anims.create({
            key: 'rigth',
            frames: anims.generateFrameNumbers(this.textureKey, {
                start: 27,
                end: 35,
            }),
            frameRate: this.animsFrameRate,
            repeat: -1,
        });

        let volume = this.scene.sound.add('man-run');
        volume.setVolume(4);
        volume = this.scene.sound.add('man-walk');
        volume.setVolume(2);
    }

    update(delta: number): void {
        //прослушиватели событий
        const keys = this.scene.input.keyboard?.createCursorKeys();

        if (!keys) throw new Error('Keyboard is not definted');

        let nextSoundKey = null;

        //логика по работе с движением
        this.speed = delta * 10;

        //если нажать шифт
        if (keys.shift.isDown) {
            this.speed *= 2;
            this.animsFrameRate = this._FRAMERATE.FAST;
            nextSoundKey = 'man-run';
        } else {
            this.animsFrameRate = this._FRAMERATE.SLOW;
            nextSoundKey = 'man-walk';
        }

        this.isMoving = false;
        //также надо обработать случай движения наискосок
        const isHorizontalMove = keys.left.isDown || keys.right.isDown;
        const isVerticallMove = keys.up.isDown || keys.down.isDown;
        const isDiagonallyMove = isHorizontalMove && isVerticallMove;

        //проверка если пытаемся двигаться одновременно в противоположных направлениях
        if ((keys.up.isDown && keys.down.isDown) || (keys.left.isDown && keys.right.isDown)) {
            this.isMoving = false;
            if (keys.up.isDown && keys.down.isDown) {
                this.play('down', true);
                this.setVelocityY(0);
            }
            if (keys.left.isDown && keys.right.isDown) {
                this.play('left', true);
                this.setVelocityX(0);
            }

            if (!isVerticallMove) {
            }
        }
        //если диагональное движение
        else if (isDiagonallyMove) {
            this.isMoving = true;

            if (keys.up.isDown) {
                this._toTop(this.speed * 0.7);
            }
            if (keys.down.isDown) {
                this._toBottom(this.speed * 0.7);
            }
            if (keys.left.isDown) {
                this.play('left', true);
                this._toLeft(this.speed * 0.75);
            }
            if (keys.right.isDown) {
                this.play('rigth', true);
                this._toRigth(this.speed * 0.75);
            }
        } else {
            if (keys.up.isDown) {
                this.play('up', true);
                this._toTop(this.speed);
                this.isMoving = true;
            }
            if (keys.down.isDown) {
                this.play('down', true);
                this._toBottom(this.speed);
                this.isMoving = true;
            }
            if (keys.left.isDown) {
                this.play('left', true);
                this._toLeft(this.speed);
                this.isMoving = true;
            }
            if (keys.right.isDown) {
                this.play('rigth', true);
                this._toRigth(this.speed);
                this.isMoving = true;
            }
        }

        //работа если не двигается персонаж
        if (!isHorizontalMove) {
            this.setVelocityX(0);
        }

        if (!isVerticallMove) {
            this.setVelocityY(0);
        }

        if (!this.isMoving || (!isVerticallMove && !isHorizontalMove)) {
            this.stop();
            nextSoundKey = null;
        }

        if (nextSoundKey != this.activeSoundKey) {
            if (this.activeSoundKey) {
                const soundPrev = this.scene.sound.get(this.activeSoundKey);

                soundPrev.stop();
            }
            if (nextSoundKey) {
                const soundPrev = this.scene.sound.get(nextSoundKey);

                soundPrev.play();
            }
            this.activeSoundKey = nextSoundKey;
        }
    }

    private _toTop(delta: number) {
        this.setVelocityY(-delta);
    }

    private _toBottom(delta: number) {
        this.setVelocityY(delta);
    }
    private _toLeft(delta: number) {
        this.setVelocityX(-delta);
    }

    private _toRigth(delta: number) {
        this.setVelocityX(delta);
    }

    // public getLight() {
    //     return this._playerLight;
    // }
}
