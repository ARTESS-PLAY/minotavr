import { PathNode } from "../objects/PathNode.mjs";

class PathFinder {
    constructor(width, height, tileValidityArray) {
        this.width = width;
        this.height = height;
        this.tileValidityArray = tileValidityArray;
    }

    getBestPathNode(PathNodes) {
        let bestIndex = 0;
        for (let i = 1; i < PathNodes.length; i++) {
            if (PathNodes[i].f < PathNodes[bestIndex].f) {
                bestIndex = i;
            }
        }
        return bestIndex;
    }

    isInList(list, x, y) {
        return list.some(PathNode => PathNode.s.x === x && PathNode.s.y === y);
    }

    getPathNodeFromList(list, x, y) {
        const foundPathNode = list.find(PathNode => PathNode.s.x === x && PathNode.s.y === y);
        return foundPathNode || null;
    }

    tileValid(x, y) {
        return this.tileValidityArray[x + y * this.width] === 0;
    }

    addOrUpdatePathNode(list, newPathNode) {
        const existingPathNode = this.getPathNodeFromList(list, newPathNode.s.x, newPathNode.s.y);
        if (existingPathNode) {
            if (newPathNode.f < existingPathNode.f) {
                existingPathNode.g = newPathNode.g;
                existingPathNode.h = newPathNode.h;
                existingPathNode.f = newPathNode.f;
                existingPathNode.parent = newPathNode.parent;
            }
        } else {
            list.push(newPathNode);
        }
    }

    getPath(sx, sy, gx, gy, path) {
        const openList = [];
        const closedList = [];
        openList.push(new PathNode(sx, sy, gx, gy, 0, null));

        while (openList.length > 0) {
            const currentIndex = this.getBestPathNode(openList);
            const currentPathNode = openList[currentIndex];

            if (currentPathNode.s.x === gx && currentPathNode.s.y === gy) {
                let p = 0;
                if (path) {
                    let PathNode = currentPathNode;
                    while (PathNode) {
                        path.unshift(PathNode.s);
                        PathNode = PathNode.parent ? this.getPathNodeFromList(closedList, PathNode.parent.x, PathNode.parent.y) : null;
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
                { x: currentPathNode.s.x, y: currentPathNode.s.y + 1 }
            ];

            for (const neighbor of neighbors) {
                if (neighbor.x < 0 || neighbor.x >= this.width || neighbor.y < 0 || neighbor.y >= this.height) continue;
                if (this.isInList(closedList, neighbor.x, neighbor.y)) continue;
                if (!this.tileValid(neighbor.x, neighbor.y)) continue;

                const g = currentPathNode.g + 1;
                const newPathNode = new PathNode(neighbor.x, neighbor.y, gx, gy, g, currentPathNode.s);
                this.addOrUpdatePathNode(openList, newPathNode);
            }
        }
        return 0; // Путь не найден
    }
}

export { PathFinder};
