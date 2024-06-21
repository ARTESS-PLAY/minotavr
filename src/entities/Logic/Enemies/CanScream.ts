/**
 * Компонент вызывает скример
 */

import { Entity } from '../../Entity';
import { Component } from '../Component';

export class CanScream extends Component {
    private sreamImgKey: string;
    private screamSoundKey: string;
    private screamerSceneKey: string;

    constructor(
        obj: Entity,
        sreamImgKey: string,
        screamSoundKey: string,
        screamerSceneKey: string = 'ScreamerScene',
    ) {
        super('canScream', obj);

        this.sreamImgKey = sreamImgKey;
        this.screamSoundKey = screamSoundKey;
        this.screamerSceneKey = screamerSceneKey;
    }

    /**
     * Вызывает скример
     */
    public sream() {
        this.entity.scene.scene.stop();
        this.entity.scene.scene.start(this.screamerSceneKey, {
            sreamImgKey: this.sreamImgKey,
            screamSoundKey: this.screamSoundKey,
        });
    }

    /**
     * Вызывает скример паралельно
     */
    public sreamParalel() {
        this.entity.scene.scene.launch(this.screamerSceneKey, {
            sreamImgKey: this.sreamImgKey,
            screamSoundKey: this.screamSoundKey,
        });
    }
}
