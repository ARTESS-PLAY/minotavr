class PathNode {
    constructor(x, y, gx, gy, g, parent) {
        this.s = { x: x, y: y };
        this.g = g;
        this.h = Math.abs(x - gx) + Math.abs(y - gy);
        this.f = g + this.h;
        this.parent = parent;
    }
}
export { PathNode };