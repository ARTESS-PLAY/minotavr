export class Cell {
    rightWall: boolean;
    leftWall: boolean;
    downWall: boolean;
    upWall: boolean;
    constructor() {
        this.upWall = true;
        this.downWall = true;
        this.leftWall = true;
        this.rightWall = true;
    }
}
