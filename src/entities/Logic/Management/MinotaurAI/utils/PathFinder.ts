import { TilesIndexes } from '../../../../../utils/constants';
import { PathNode } from '../objects/PathNode';
import { Path } from './MinotaurMovement';

export class PathFinder {
    // Карта тайлов
    public tileValidityArray: Phaser.Tilemaps.Tile[][];

    // Размер карты
    public size: number;

    constructor(size: number, tileValidityArray: Phaser.Tilemaps.Tile[][]) {
        this.size = size;
        this.tileValidityArray = tileValidityArray;
    }

    /**
     * Выбирает лучший случий, наверное (чего?)
     */
    getBestPathNode(PathNodes: PathNode[]) {
        let bestIndex = 0;
        for (let i = 1; i < PathNodes.length; i++) {
            if (PathNodes[i].f < PathNodes[bestIndex].f) {
                bestIndex = i;
            }
        }
        return bestIndex;
    }

    /**
     * Проверяет есть ли нода в списке
     */
    isInList(list: PathNode[], x: number, y: number) {
        return list.some((PathNode) => PathNode.s.x === x && PathNode.s.y === y);
    }

    /**
     * Находит ноду по x y
     */
    getPathNodeFromList(list: PathNode[], x: number, y: number) {
        const foundPathNode = list.find((PathNode) => PathNode.s.x === x && PathNode.s.y === y);
        return foundPathNode || null;
    }

    /**
     * Проверяет на пустоту в тайле
     */
    tileValid(x: number, y: number) {
        return this.tileValidityArray[y][x].index === TilesIndexes.EMPTY;
    }

    /**
     * Добавляет ноду в путь, либо обновляет ноду для лучшего пути
     */
    addOrUpdatePathNode(list: PathNode[], newPathNode: PathNode) {
        const existingPathNode = this.getPathNodeFromList(list, newPathNode.s.x, newPathNode.s.y);
        if (existingPathNode) {
            if (newPathNode.f < existingPathNode.f) {
                existingPathNode.g = newPathNode.g;
                existingPathNode.everistic = newPathNode.everistic;
                existingPathNode.f = newPathNode.f;
                existingPathNode.parent = newPathNode.parent;
            }
        } else {
            list.push(newPathNode);
        }
    }

    getPath(sx: number, sy: number, gx: number, gy: number, path: Path) {
        // Точки которые мы провреили
        const openList = [];

        // Точки которые мы не провреили
        const closedList = [];
        openList.push(new PathNode(sx, sy, gx, gy, 0, null));

        while (openList.length > 0) {
            const currentIndex = this.getBestPathNode(openList);
            const currentPathNode = openList[currentIndex];

            if (currentPathNode.s.x === gx && currentPathNode.s.y === gy) {
                let p = 0;
                if (path) {
                    let PathNode: PathNode | null = currentPathNode;
                    while (PathNode) {
                        path.unshift(PathNode.s);

                        PathNode = PathNode.parent
                            ? this.getPathNodeFromList(
                                  closedList,
                                  PathNode.parent.s.x,
                                  PathNode.parent.s.y,
                              )
                            : null;
                        p++;
                    }
                }
                return p;
            }

            closedList.push(currentPathNode);
            openList.splice(currentIndex, 1);

            const neighbors = [
                { x: currentPathNode.s.x - 1, y: currentPathNode.s.y },
                { x: currentPathNode.s.x + 1, y: currentPathNode.s.y },
                { x: currentPathNode.s.x, y: currentPathNode.s.y - 1 },
                { x: currentPathNode.s.x, y: currentPathNode.s.y + 1 },
            ];

            for (const neighbor of neighbors) {
                if (
                    neighbor.x < 0 ||
                    neighbor.x >= this.size ||
                    neighbor.y < 0 ||
                    neighbor.y >= this.size
                )
                    continue;

                if (this.isInList(closedList, neighbor.x, neighbor.y)) continue;
                if (!this.tileValid(neighbor.x, neighbor.y)) continue;

                const g = currentPathNode.g + 1;
                const newPathNode = new PathNode(
                    neighbor.x,
                    neighbor.y,
                    gx,
                    gy,
                    g,
                    currentPathNode,
                );
                this.addOrUpdatePathNode(openList, newPathNode);
            }
        }
        return 0; // Путь не найден
    }
}
