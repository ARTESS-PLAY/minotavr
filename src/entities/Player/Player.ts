import { SPRITES } from '../../utils/constants';
import { Entity } from '../Entity';
import { PlayerManagement } from '../Logic/Management/PlayerManagement';
import { Move } from '../Logic/Movement/Move';
import { MoveController } from '../Logic/Movement/MoveController';

/**
 * Класс отвечает за логику работы игрока
 */

export class Player extends Entity {
    private textureKey: string;
    private animsFrameRate: number;
    private activeSoundKey?: null | string;

    private _FRAMERATE = {
        SLOW: 16,
        FAST: 32,
    };

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture, SPRITES.PLAYER);

        /**
         * Добавляем компоненты
         */

        // Управление
        this.addComponent(new PlayerManagement(this));

        // Передвижение
        this.addComponent(new Move(this));

        // Передвижение игрока
        this.addComponent(new MoveController(this));

        const anims = this.scene.anims;
        this.animsFrameRate = this._FRAMERATE.SLOW;

        this.textureKey = texture;

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
        const playerManagement = this.getComponent('playerManagement') as PlayerManagement;
        const move = this.getComponent('move') as Move;
        const moveController = this.getComponent('moveController') as MoveController;

        if (!playerManagement || !moveController || !move) {
            throw new Error('Не найден нужный компонент');
        }

        playerManagement.update();
        moveController.updateMove(delta);

        let nextSoundKey = null;

        //если нажать шифт
        if (move.isGoRunnig) {
            this.animsFrameRate = this._FRAMERATE.FAST;
            nextSoundKey = 'man-run';
        } else {
            this.animsFrameRate = this._FRAMERATE.SLOW;
            nextSoundKey = 'man-walk';
        }

        //проверка если пытаемся двигаться одновременно в противоположных направлениях
        if (moveController.isOppositeMove) {
            if (move.isGoUp && move.isGoDown) {
                this.play('down', true);
            }
            if (move.isGoLeft && move.isGoRight) {
                this.play('left', true);
            }
        }

        //если диагональное движение
        else if (moveController.isDiagonallyMove) {
            if (move.isGoLeft) {
                this.play('left', true);
            }
            if (move.isGoRight) {
                this.play('rigth', true);
            }
        } else {
            if (move.isGoUp) {
                this.play('up', true);
            }
            if (move.isGoDown) {
                this.play('down', true);
            }
            if (move.isGoLeft) {
                this.play('left', true);
            }
            if (move.isGoRight) {
                this.play('rigth', true);
            }
        }

        if (!move.isMoving) {
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
}
