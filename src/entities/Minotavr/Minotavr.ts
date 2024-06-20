import { SPRITES } from '../../utils/constants';
import { Entity } from '../Entity';
import { MinotavrManagement } from '../Logic/Management/MinotaurAI';
import { Move } from '../Logic/Movement/Move';
import { MoveController } from '../Logic/Movement/MoveController';
import { SoundWalk } from '../Logic/Sound/SoundWalk';

/**
 * Класс отвечает за логику работы игрока минтоавра
 */

export class Minotavr extends Entity {
    private textureKey: string;
    private animsFrameRate: number;

    private _FRAMERATE = {
        SLOW: 16,
        FAST: 32,
    };

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture, SPRITES.PLAYER);

        /**
         * Добавляем компоненты
         */

        // ии управление минотавром
        this.addComponent(new MinotavrManagement(this));

        // Передвижение
        this.addComponent(new Move(this));

        // Передвижение игрока
        this.addComponent(new MoveController(this));

        // Звуки при ходьбе
        this.addComponent(new SoundWalk(this, 'man-walk', 'man-run'));

        const anims = this.scene.anims;
        this.animsFrameRate = this._FRAMERATE.SLOW;

        this.textureKey = texture;

        //уменьшаем размеры блока
        this.setSize(24, 30);
        this.setOffset(20, 20);

        anims.create({
            key: 'minotavrUp',
            frames: anims.generateFrameNumbers(this.textureKey, {
                start: 0,
                end: 8,
            }),
            frameRate: this.animsFrameRate,
            repeat: -1,
        });

        anims.create({
            key: 'minotavrLeft',
            frames: anims.generateFrameNumbers(this.textureKey, {
                start: 9,
                end: 17,
            }),
            frameRate: this.animsFrameRate,
            repeat: -1,
        });

        anims.create({
            key: 'minotavrDown',
            frames: anims.generateFrameNumbers(this.textureKey, {
                start: 18,
                end: 26,
            }),
            frameRate: this.animsFrameRate,
            repeat: -1,
        });

        anims.create({
            key: 'minotavrRight',
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

        // Ставим коэфициенты
        const minotavrManagement = this.getComponent('minotavrManagement') as MinotavrManagement;
        minotavrManagement.enable();
    }

    update(delta: number): void {
        const minotavrManagement = this.getComponent('minotavrManagement') as MinotavrManagement;
        const move = this.getComponent('move') as Move;
        const moveController = this.getComponent('moveController') as MoveController;
        const soundWalk = this.getComponent('soundWalk') as SoundWalk;

        if (!moveController || !move || !soundWalk || !minotavrManagement) {
            throw new Error('Не найден нужный компонент');
        }

        minotavrManagement.update();
        moveController.updateMove(delta);
        soundWalk.updateSound();

        //если нажать шифт
        if (move.isGoRunnig) {
            this.animsFrameRate = this._FRAMERATE.FAST;
        } else {
            this.animsFrameRate = this._FRAMERATE.SLOW;
        }

        //проверка если пытаемся двигаться одновременно в противоположных направлениях
        if (moveController.isOppositeMove) {
            if (move.isGoUp && move.isGoDown) {
                this.play('minotavrDown', true);
            }
            if (move.isGoLeft && move.isGoRight) {
                this.play('minotavrLeft', true);
            }
        }

        //если диагональное движение
        else if (moveController.isDiagonallyMove) {
            if (move.isGoLeft) {
                this.play('minotavrLeft', true);
            }
            if (move.isGoRight) {
                this.play('minotavrRight', true);
            }
        } else {
            if (move.isGoUp) {
                this.play('minotavrUp', true);
            }
            if (move.isGoDown) {
                this.play('minotavrDown', true);
            }
            if (move.isGoLeft) {
                this.play('minotavrLeft', true);
            }
            if (move.isGoRight) {
                this.play('minotavrRight', true);
            }
        }

        if (!move.isMoving) {
            this.stop();
        }
    }
}
