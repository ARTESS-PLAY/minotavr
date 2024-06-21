import { Labyrinth } from '../../scenes/Labyrinth/Labyrinth';
import { GOST_SCREAMERS, SPRITES } from '../../utils/constants';
import { randomInteger } from '../../utils/numbers';
import { Entity } from '../Entity';
import { CanScream } from '../Logic/Enemies/CanScream';
import { GostManagement } from '../Logic/Management/GostManagement';
import { Move } from '../Logic/Movement/Move';
import { MoveController } from '../Logic/Movement/MoveController';
import { SoundWalk } from '../Logic/Sound/SoundWalk';

/**
 * Класс отвечает за логику работы призраков
 */

export class Gost extends Entity {
    private textureKey: string;
    private animsFrameRate: number;
    public walkSound:
        | Phaser.Sound.NoAudioSound
        | Phaser.Sound.HTML5AudioSound
        | Phaser.Sound.WebAudioSound
        | null = null;

    private _FRAMERATE = {
        SLOW: 8,
        FAST: 16,
    };

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture, SPRITES.GOST);

        /**
         * Добавляем компоненты
         */

        // Передвижение
        this.addComponent(new Move(this));

        // Передвижение игрока
        this.addComponent(new MoveController(this));

        // Логика передвижения призрака
        this.addComponent(new GostManagement(this));

        // Звуки при ходьбе
        this.addComponent(new SoundWalk(this, 'gost-walk', 'man-run'));

        const numberImage = randomInteger(GOST_SCREAMERS.MIN_IMAGE, GOST_SCREAMERS.MAX_IMAGE);
        const numberSound = randomInteger(GOST_SCREAMERS.MIN_SOUND, GOST_SCREAMERS.MAX_SOUND);

        // Скример
        this.addComponent(
            new CanScream(
                this,
                `${GOST_SCREAMERS.IMAGE}${numberImage}`,
                `${GOST_SCREAMERS.AUDIO}${numberSound}`,
                'ScreamerEasy',
            ),
        );

        const anims = this.scene.anims;
        this.animsFrameRate = this._FRAMERATE.SLOW;

        this.textureKey = texture;

        //уменьшаем размеры блока
        this.setSize(30, 30);
        this.scale = 1;

        if (!anims.get('gostUp')) {
            anims.create({
                key: 'gostUp',
                frames: anims.generateFrameNumbers(this.textureKey, {
                    start: 12,
                    end: 15,
                }),
                frameRate: this.animsFrameRate,
                repeat: -1,
            });
        }

        if (!anims.get('gostLeft')) {
            anims.create({
                key: 'gostLeft',
                frames: anims.generateFrameNumbers(this.textureKey, {
                    start: 4,
                    end: 7,
                }),
                frameRate: this.animsFrameRate,
                repeat: -1,
            });
        }

        if (!anims.get('gostDown')) {
            anims.create({
                key: 'gostDown',
                frames: anims.generateFrameNumbers(this.textureKey, {
                    start: 0,
                    end: 3,
                }),
                frameRate: this.animsFrameRate,
                repeat: -1,
            });
        }

        if (!anims.get('gostRight')) {
            anims.create({
                key: 'gostRight',
                frames: anims.generateFrameNumbers(this.textureKey, {
                    start: 8,
                    end: 11,
                }),
                frameRate: this.animsFrameRate,
                repeat: -1,
            });
        }

        let volume = this.scene.sound.add('man-run');
        volume.setVolume(0);
        this.walkSound = this.scene.sound.add('gost-walk');
        this.walkSound.setVolume(0.1);
        this.walkSound.loop = true;
        this.walkSound.stop();

        // Ставим коэфициенты
        const gostManagement = this.getComponent('gostManagement') as GostManagement;
        gostManagement.enable();
    }

    update(delta: number): void {
        const move = this.getComponent('move') as Move;
        const moveController = this.getComponent('moveController') as MoveController;
        const gostManagement = this.getComponent('gostManagement') as GostManagement;
        const soundWalk = this.getComponent('soundWalk') as SoundWalk;

        if (!moveController || !move || !soundWalk || !gostManagement) {
            throw new Error('Не найден нужный компонент');
        }

        gostManagement.update();
        moveController.updateMove(delta);

        //проверка если пытаемся двигаться одновременно в противоположных направлениях
        if (moveController.isOppositeMove) {
            if (move.isGoUp && move.isGoDown) {
                this.play('gostDown', true);
            }
            if (move.isGoLeft && move.isGoRight) {
                this.play('gostLeft', true);
            }
        }

        //если диагональное движение
        else if (moveController.isDiagonallyMove) {
            if (move.isGoLeft) {
                this.play('gostLeft', true);
            }
            if (move.isGoRight) {
                this.play('gostRight', true);
            }
        } else {
            if (move.isGoUp) {
                this.play('gostUp', true);
            }
            if (move.isGoDown) {
                this.play('gostDown', true);
            }
            if (move.isGoLeft) {
                this.play('gostLeft', true);
            }
            if (move.isGoRight) {
                this.play('gostRight', true);
            }
        }

        if (!move.isMoving) {
            this.stop();
        } else {
        }
        this.updateSound();
    }

    updateSound() {
        const player = (this.scene as Labyrinth).player;

        if (!player || !this.walkSound) return;

        const dictance = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);

        const minDistance = 500;

        if (dictance < minDistance) {
            if (!this.walkSound.isPlaying) this.walkSound.play();

            this.walkSound.volume = Math.min(0.7, minDistance / dictance / 4);
        } else {
            this.walkSound.stop();
        }
    }

    delete() {
        if (this.walkSound) this.walkSound.stop();
    }
}
