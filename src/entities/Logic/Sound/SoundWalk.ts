import { Entity } from '../../Entity';
import { Component } from '../Component';
import { Move } from '../Movement/Move';

/**
 * Компонент отвечает за работу звука при ходьбе
 *
 * ЗАВИСИМОСТЬ: MOVE
 */
export class SoundWalk extends Component {
    //Звук ходьбы
    private walkKey: string | null = null;

    //Звук бега
    private RunKey: string | null = null;

    //Ключа текущего звука
    private activeSoundKey: null | string = null;

    constructor(obj: Entity, walkKey: string | null, RunKey: string | null) {
        super('soundWalk', obj);
        this.walkKey = walkKey;
        this.RunKey = RunKey;
    }

    updateSound() {
        const entity = this.entity;

        const move = entity.getComponent('move') as Move;

        let nextSoundKey: string | null = null;

        if (move.isGoRunnig) {
            nextSoundKey = this.RunKey;
        } else {
            nextSoundKey = this.walkKey;
        }

        if (!move.isMoving) {
            nextSoundKey = null;
        }

        if (nextSoundKey != this.activeSoundKey) {
            if (this.activeSoundKey) {
                const soundPrev = this.entity.scene.sound.get(this.activeSoundKey);

                soundPrev.stop();
            }
            if (nextSoundKey) {
                const soundPrev = this.entity.scene.sound.get(nextSoundKey);

                soundPrev.play();
            }
            this.activeSoundKey = nextSoundKey;
        }
    }
}
