import { Minotavr } from './../../../Minotavr/Minotavr';
import { Labyrinth } from '../../../../scenes/Labyrinth/Labyrinth.js';
import { LAYERS, MAP_SIZE } from '../../../../utils/constants.js';
import { Entity } from '../../../Entity.js';
import { Component } from '../../Component.js';
import { Move } from '../../Movement/Move.js';
import { MinotaurMovement } from './utils/MinotaurMovement.js';
import { MovementData } from '../../Movement/types.js';

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
        move.speedRunKoef = 1.3;
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

        const timeResult = this.mv.moveMinotaur(minotaveTile, playerTile);
        const result = this.movementRate(scene.minotavr, minotaveTile, timeResult);

        // Обновляем его состояния
        move.isGoDown = result.down;
        move.isGoLeft = result.left;
        move.isGoRight = result.right;
        move.isGoUp = result.up;
        move.isGoRunnig = result.isRunning;
    }

    /**
     * Погрешность движения
     */
    movementRate(minotavr: Minotavr, currentTiled: Phaser.Tilemaps.Tile, result: MovementData) {
        // Проверим в тайле ли полностью
        const minotavrLeftX = minotavr.x - 14 / 2;
        const minotavrRightX = minotavr.x + 14 / 2;
        const minotavrtopY = minotavr.y - 14 / 2;
        const minotavrbottomY = minotavr.y + 14 / 2;

        // Если наш минотавр в тайле полностью - делать ничего не нужно
        if (
            minotavrLeftX > currentTiled.pixelX &&
            minotavrRightX < currentTiled.pixelX + currentTiled.width &&
            minotavrtopY > currentTiled.pixelY &&
            minotavrbottomY < currentTiled.pixelY + currentTiled.height
        ) {
            return result;
        }

        // Если мы оказались выше  - идём вниз
        if (minotavrtopY <= currentTiled.pixelY) {
            result.down = !result.up && true;
        }

        // Если мы оказались ниже  - идём вверх
        else if (minotavrbottomY >= currentTiled.pixelY + currentTiled.height) {
            result.up = !result.down && true;
        }

        // Если мы оказались леве  - идём вправо
        if (minotavrLeftX <= currentTiled.pixelX) {
            result.right = !result.left && true;
        }

        // Если мы оказались правее  - идём влево
        else if (minotavrRightX >= currentTiled.pixelX + currentTiled.width) {
            result.left = !result.right && true;
        }

        return result;
    }
}
