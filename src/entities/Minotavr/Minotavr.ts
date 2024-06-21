import { Labyrinth } from '../../scenes/Labyrinth/Labyrinth';
import { SPRITES } from '../../utils/constants';
import { Entity } from '../Entity';
import { CanScream } from '../Logic/Enemies/CanScream';
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
    public minotavrWalk:
        | Phaser.Sound.NoAudioSound
        | Phaser.Sound.HTML5AudioSound
        | Phaser.Sound.WebAudioSound
        | null = null;

    private _FRAMERATE = {
        SLOW: 8,
        FAST: 16,
    };

    private replicKeys = ['replic1', 'replic2', 'replic3', 'replic4', 'replic5', 'replic6'];

    private replicKeysSayd: Array<string> = [];

    private activeReplic: string | null = null;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture, SPRITES.MINOTAVR);

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
        this.addComponent(new SoundWalk(this, 'minotavr-walk', 'man-run'));

        // Скример
        this.addComponent(new CanScream(this, 'screamBG', 'scream'));

        const anims = this.scene.anims;
        this.animsFrameRate = this._FRAMERATE.SLOW;

        this.textureKey = texture;

        //уменьшаем размеры блока
        this.setSize(10, 10);
        this.scale = 1.4;

        anims.create({
            key: 'minotavrUp',
            frames: anims.generateFrameNumbers(this.textureKey, {
                start: 24,
                end: 27,
            }),
            frameRate: this.animsFrameRate,
            repeat: -1,
        });

        anims.create({
            key: 'minotavrLeft',
            frames: anims.generateFrameNumbers(this.textureKey, {
                start: 8,
                end: 11,
            }),
            frameRate: this.animsFrameRate,
            repeat: -1,
        });

        anims.create({
            key: 'minotavrDown',
            frames: anims.generateFrameNumbers(this.textureKey, {
                start: 0,
                end: 3,
            }),
            frameRate: this.animsFrameRate,
            repeat: -1,
        });

        anims.create({
            key: 'minotavrRight',
            frames: anims.generateFrameNumbers(this.textureKey, {
                start: 16,
                end: 19,
            }),
            frameRate: this.animsFrameRate,
            repeat: -1,
        });

        let volume = this.scene.sound.add('man-run');
        volume.setVolume(4);
        this.minotavrWalk = this.scene.sound.add('minotavr-walk');
        this.minotavrWalk.setVolume(1);
        this.minotavrWalk.loop = true;
        this.minotavrWalk.stop();

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
        } else {
            this.updateSound();
        }
    }

    updateSound() {
        const player = (this.scene as Labyrinth).player;

        if (!player || !this.minotavrWalk) return;

        const dictance = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);

        const minDistance = 1000;

        if (dictance < minDistance) {
            if (!this.minotavrWalk.isPlaying) this.minotavrWalk.play();

            this.minotavrWalk.volume = Math.min(1.1, minDistance / dictance / 4);

            this.sayRandomReplics();
        } else {
            this.minotavrWalk.stop();
        }
    }

    /**
     * Говорит случайную реплику
     */
    sayRandomReplics() {
        // Значит уже что-то говорит
        if (this.activeReplic) return;

        const player = (this.scene as Labyrinth).player;

        if (!player || !this.minotavrWalk) return;

        const dictance = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);

        if (dictance < 200) {
            // Берём случайную реплику
            const replicKey = this.replicKeys[Math.floor(Math.random() * this.replicKeys.length)];

            // Удаляем её
            const index = this.replicKeys.indexOf(replicKey);
            this.replicKeys.splice(index, 1);

            // И несём в массив сказаных реплик
            this.replicKeysSayd.push(replicKey);

            // Начинаем говорить
            const replic = this.scene.sound.add(replicKey);
            replic.volume = 1.5;
            replic.play();
            this.activeReplic = replicKey;

            this.scene.time.addEvent({
                delay: replic.duration * 1000 + 2000,
                callback: () => {
                    this.activeReplic = null;

                    // Если реплики закончились - обновляем
                    if (!this.replicKeys.length) {
                        this.replicKeys = this.replicKeysSayd;
                        this.replicKeysSayd = [];
                    }
                },
            });
        }
    }
}
