/**
 * Компонент вызывает скример
 */

import { Entity } from '../../Entity';
import { Component } from '../Component';

export class CanScream extends Component {
    private sreamImgKey: string;
    private screamSoundKey: string;

    constructor(obj: Entity, sreamImgKey: string, screamSoundKey: string) {
        super('canScream', obj);

        this.sreamImgKey = sreamImgKey;
        this.screamSoundKey = screamSoundKey;
    }

    /**
     * Вызывает скример
     */
    public sream() {
        this.entity.scene.scene.stop();
        this.entity.scene.scene.start('ScreamerScene', {
            sreamImgKey: this.sreamImgKey,
            screamSoundKey: this.screamSoundKey,
        });
    }
}
