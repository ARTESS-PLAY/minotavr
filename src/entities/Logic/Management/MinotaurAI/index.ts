import { Labyrinth } from '../../../../scenes/Labyrinth/Labyrinth.js';
import { LAYERS, MAP_SIZE, TilesIndexes } from '../../../../utils/constants.js';
import { Entity } from '../../../Entity.js';
import { Component } from '../../Component.js';
import { Move } from '../../Movement/Move.js';
import { MinotaurMovement } from './utils/MinotaurMovement.js';

/**
 * Класс отвечает за управление минонавром
 *
 * ЗАВИСИМОСТЬ: MOVE
 */
export class MinotavrManagement extends Component {
    private mv: MinotaurMovement;

    constructor(obj: Entity) {
        super('minotavrManagement', obj);
        const scene = obj.scene as Labyrinth;
        const walls = scene.layers.find((el) => el?.layer.name == LAYERS.WALLS);

        if (!walls) throw new Error('Стены не найдены');

        this.mv = new MinotaurMovement(MAP_SIZE, walls.layer.data);
    }

    /**
     * Устанавливаем все коэфициенты
     */
    enable() {
        // Устанавливаем коэфициенты бега
        const move = this.entity.getComponent('move') as Move;
        move.speedKoef = 5;
        move.speedRunKoef = 1.5;
    }

    update() {
        const move = this.entity.getComponent('move') as Move;
        const scene = this.entity.scene as Labyrinth;

        const ground = scene.layers.find((el) => el?.layer.name == LAYERS.GROUNG);

        if (!scene.minotavr || !scene.player || !ground) throw new Error('не найден нужный объект');

        const playerTile = scene.map?.getTileAtWorldXY(
            scene.player.x,
            scene.player.y,
            true,
            scene.cameras.main,
            ground,
        );

        const minotaveTile = scene.map?.getTileAtWorldXY(
            scene.minotavr.x,
            scene.minotavr.y,
            true,
            scene.cameras.main,
            ground,
        );

        if (!playerTile || !minotaveTile) throw new Error('не найден нужный тайл');

        const result = this.mv.moveMinotaur(minotaveTile, playerTile);

        // Обновляем его состояния
        move.isGoDown = result.down;
        move.isGoLeft = result.left;
        move.isGoRight = result.right;
        move.isGoUp = result.up;
        move.isGoRunnig = result.isRunning;
    }
}
