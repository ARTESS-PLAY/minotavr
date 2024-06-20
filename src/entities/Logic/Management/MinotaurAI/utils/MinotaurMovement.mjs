import { PathFinder } from "./PathFinder.mjs";
const SHIFT_DISTANCE = 4;
class MinotaurMovement {
    constructor(mapSize, tileArray){
        this.mapSize = mapSize;
        this.tileArray = tileArray;

        this.pathFinder = new PathFinder(mapSize, tileArray);
        this.path = [];
        this.pathLength = 0;
        this.initializePath();
    }

    initializePath(startX, startY, goalX, goalY, path) {
        this.pathLength = this.pathFinder.getPath(startX, startY, goalX, goalY, path);
    }

    getPath() {
        return this.path;
    }

    getPathLength() {
        return this.pathLength;
    }
    
    moveMinotaur(startX, startY, goalX, goalY){
        let isRunning = false;
        let direction = undefined;
        this.initializePath(startX, startY, goalX, goalY, this.path);
        console.log(this.path[0])
        console.log(this.path[1])
        if (this.pathLength > 0){
            if(this.pathLength > SHIFT_DISTANCE){
                direction = this.directionCheck(startX, startY, goalX, goalY);
                isRunning = false;
            } else {
                direction = this.directionCheck(startX, startY, goalX, goalY);
                isRunning = true;
            }
        }
        return {direction, isRunning}
    }

    directionCheck(startX, startY, goalX, goalY){
        if (startX !== goalX || startY !== goalY){
            if (startX > this.path[1].x) {
                return 'left'
            } else if (startX < this.path[1].x){
                return 'right'
            } else if(startY > this.path[1].y){
                return 'up'
            } else if (startY < this.path[1].y){
                return 'down'
            }
        } else{
            return 'stop'
        }
    }

    isRunway(){
        let xFlag = true;
        let yFlag = true;
        for (let i = 0; i < this.pathLength; i++) {
            xFlag = xFlag && (startX === this.path[i].x);
            yFlag = yFlag && (startY === this.path[i].y);
            if (!xFlag && !yFlag) {
                return false;
            }
        }
        return (xFlag || yFlag)
    }

}

export {MinotaurMovement};