/**
 * Компонент отвечает за работу звука при ходьбе
 */

import { Entity } from '../../Entity';
import { Component } from '../Component';

class SoundWalk extends Component {
    constructor(obj: Entity) {
        super('soundWalk', obj);
    }
}
