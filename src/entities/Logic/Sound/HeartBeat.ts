import { Entity } from '../../Entity';
import { Component } from '../Component';
/**
 * Компонент отвечает за звуки биения сердца в зависимости от дистанции минотавра
 */

const minDistance = 2000;
const minDistanceSpeed = 1000;

export class HeartBeat extends Component {
    private target: Entity | null = null;

    private heartSound:
        | Phaser.Sound.NoAudioSound
        | Phaser.Sound.HTML5AudioSound
        | Phaser.Sound.WebAudioSound;

    constructor(obj: Entity, heartKey: string) {
        super('heartBeat', obj);
        this.heartSound = obj.scene.sound.add(heartKey);
        this.heartSound.loop = true;
        this.heartSound.volume = 0;
    }

    setTarget(target: Entity) {
        this.target = target;
    }

    update() {
        if (!this.target) return;

        const dictance = Phaser.Math.Distance.Between(
            this.entity.x,
            this.entity.y,
            this.target.x,
            this.target.y,
        );

        // Громкость биения сердца
        if (dictance < minDistance) {
            if (!this.heartSound.isPlaying) this.heartSound.play();

            this.heartSound.volume = Math.min(2, minDistance / dictance / 3) - 1;

            // Скорость биения сердца
            if (dictance < minDistanceSpeed) {
                this.heartSound.rate = Math.min(3, minDistanceSpeed / dictance / 2);
            } else {
                this.heartSound.rate = 1;
            }
        } else {
            this.heartSound.stop();
        }
    }
}
