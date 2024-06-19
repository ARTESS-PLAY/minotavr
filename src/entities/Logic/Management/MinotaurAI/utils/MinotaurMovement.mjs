import { PathFinder } from "./PathFinder.mjs";

class MinotaurMovement {
    constructor(startX, startY, goalX, goalY, mapSize, tileArray){
        this.startX = startX;
        this.startY = startY;
        this.goalX = goalX;
        this.goalY = goalY;
        this.mapSize = mapSize;
        this.tileArray = tileArray;

        this.pathFinder = new PathFinder(mapSize, mapSize, tileArray);
        this.path = [];
        this.pathLength = 0;
        this.initializePath();
    }

    initializePath() {
        this.pathLength = this.pathFinder.getPath(this.startX, this.startY, this.goalX, this.goalY, this.path);
    }

    getPath() {
        return this.path;
    }

    getPathLength() {
        return this.pathLength;
    }
    
    moveMinotaur(){
        this.initializePath();
        if (this.pathLength > 0){
            if (this.startX !== this.goalX || this.startY !== this.goalY){
                if (this.startX > this.path[1].x) {
                    this.startX = this.path[1].x;
                    return 'left'
                } else if (this.startX < this.path[1].x){
                    this.startX = this.path[1].x;
                    return 'right'
                } else if(this.startY > this.path[1].y){
                    this.startY = this.path[1].y;
                    return 'up'
                } else if (this.startY < this.path[1].y){
                    this.startY = this.path[1].y;
                    return 'down'
                }
            } else{
                return 'stop'
            }
        }
    }

}

export {MinotaurMovement};