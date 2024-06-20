export class Node {
    index: any;
    edges: any[];
    visited: boolean;
    parent: any;
    rank: number;

    constructor(index) {
        this.index = index;
        this.edges = [];
        this.visited = false;
        this.parent = null;
        this.rank = 0;
    }

    getIndex() {
        return this.index;
    }

    addEdge(edge: any) {
        this.edges.push(edge);
    }

    getEdges() {
        return this.edges;
    }

    isVisited() {
        return this.visited;
    }

    setVisited(visited: boolean) {
        this.visited = visited;
    }

    setParent(parent: any) {
        this.parent = parent;
    }

    getParent() {
        return this.parent;
    }

    getRank() {
        return this.rank;
    }

    setRank(rank: number) {
        this.rank = rank;
    }
}
