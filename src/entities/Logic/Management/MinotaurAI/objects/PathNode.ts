export class PathNode {
    public g: number;
    public f: number;
    public everistic: number;
    public parent: PathNode | null;
    public s: { x: number; y: number };

    constructor(x: number, y: number, gx: number, gy: number, g: number, parent: PathNode | null) {
        this.s = { x, y };
        this.g = g;
        this.everistic = Math.abs(x - gx) + Math.abs(y - gy);
        this.f = g + this.everistic;
        this.parent = parent;
    }
}
