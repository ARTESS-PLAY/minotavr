import { Directions, MovementData } from '../../../Movement/types.ts';
import { PathFinder } from './PathFinder.ts';
const SHIFT_DISTANCE = 4;

export type Path = Array<{ x: number; y: number }>;

export class MinotaurMovement {
    // Массив точек куда идти минтонавру
    public path: Path;

    // Размер карты
    public mapSize: number;

    // Поиск пути
    public pathFinder: PathFinder;

    // Массив тайлов
    public tileArray: Phaser.Tilemaps.Tile[][];

    // Размер пути
    public pathLength: number;

    constructor(mapSize: number, tileArray: Phaser.Tilemaps.Tile[][]) {
        this.mapSize = mapSize * 4 + 1;
        this.tileArray = tileArray;

        this.pathFinder = new PathFinder(this.mapSize, tileArray);
        this.path = [];
        this.pathLength = 0;
    }

    initializePath(startTile: Phaser.Tilemaps.Tile, goalTile: Phaser.Tilemaps.Tile, path: Path) {
        this.pathLength = this.pathFinder.getPath(
            startTile.x,
            startTile.y,
            goalTile.x,
            goalTile.y,
            path,
        );
    }

    getPath() {
        return this.path;
    }

    getPathLength() {
        return this.pathLength;
    }

    moveMinotaur(startTile: Phaser.Tilemaps.Tile, goalTile: Phaser.Tilemaps.Tile) {
        this.initializePath(startTile, goalTile, this.path);

        let result: MovementData = {
            up: false,
            left: false,
            down: false,
            right: false,
            isRunning: false,
        };

        if (this.pathLength > 0) {
            result = Object.assign(result, this.directionCheck(startTile, goalTile));
            if (this.pathLength > SHIFT_DISTANCE) {
                result.isRunning = false;
            } else {
                result.isRunning = true;
            }
        }
        return result;
    }

    directionCheck(startTile: Phaser.Tilemaps.Tile, goalTile: Phaser.Tilemaps.Tile) {
        const result: Directions = {
            up: false,
            left: false,
            down: false,
            right: false,
        };

        if (startTile.x !== goalTile.x || startTile.y !== goalTile.y) {
            if (startTile.x > this.path[1].x) {
                result.left = true;
            } else if (startTile.x < this.path[1].x) {
                result.right = true;
            }
            if (startTile.y > this.path[1].y) {
                result.up = true;
            } else if (startTile.y < this.path[1].y) {
                result.down = true;
            }
        }

        return result;
    }

    isRunway(startTile: Phaser.Tilemaps.Tile, goalTile: Phaser.Tilemaps.Tile) {
        let xFlag = true;
        let yFlag = true;
        for (let i = 0; i < this.pathLength; i++) {
            xFlag = xFlag && startTile.x === this.path[i].x;
            yFlag = yFlag && startTile.y === this.path[i].y;
            if (!xFlag && !yFlag) {
                return false;
            }
        }
        return xFlag || yFlag;
    }
}
