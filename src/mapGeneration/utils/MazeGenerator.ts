// @ts-nocheck
import { Node } from '../details/Node.js';
import { Edge } from '../details/Edge.js';
import { Kruskal } from './Kruskal.js';
import { Cell } from '../details/Cell.js';
import fs from 'fs';
import { TILES_IDS } from './Constants.js';
//стены - 1
//полости - 3

//ground - 355, 356, 357

export class MazeGenerator {
    constructor(gridSize, maxWeight) {
        this.gridSize = gridSize;
        this.maxWeight = maxWeight;
        this.maze = this.createEmptyMaze();
    }

    //задаёт кучу пустых ячеек по форме лабиринта
    createEmptyMaze() {
        const maze = [];
        for (let row = 0; row < this.gridSize; row++) {
            const rowCells = [];
            for (let col = 0; col < this.gridSize; col++) {
                rowCells.push(new Cell());
            }
            maze.push(rowCells);
        }
        return maze;
    }

    //генерация крускалом
    generateMaze() {
        const nodes = [];
        const edges = [];

        for (let i = 0; i < this.gridSize * this.gridSize; i++) {
            nodes.push(new Node(i));
        }
        //помечаем рёбра соединений
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                if (row - 1 >= 0) {
                    const nEdge = new Edge(
                        nodes[(row - 1) * this.gridSize + col],
                        nodes[row * this.gridSize + col],
                        Math.floor(Math.random() * this.maxWeight),
                    );
                    edges.push(nEdge);
                }
                if (row + 1 < this.gridSize) {
                    const nEdge = new Edge(
                        nodes[(row + 1) * this.gridSize + col],
                        nodes[row * this.gridSize + col],
                        Math.floor(Math.random() * this.maxWeight),
                    );
                    edges.push(nEdge);
                }
                if (col - 1 >= 0) {
                    const nEdge = new Edge(
                        nodes[row * this.gridSize + col - 1],
                        nodes[row * this.gridSize + col],
                        Math.floor(Math.random() * this.maxWeight),
                    );
                    edges.push(nEdge);
                }
                if (col + 1 < this.gridSize) {
                    const nEdge = new Edge(
                        nodes[row * this.gridSize + col + 1],
                        nodes[row * this.gridSize + col],
                        Math.floor(Math.random() * this.maxWeight),
                    );
                    edges.push(nEdge);
                }
            }
        }

        const kruskal = new Kruskal(edges);
        this.mst = kruskal.findMST();

        // обновляем стены в ячейках
        for (const edge of this.mst) {
            const sourceIndex = edge.getSource().getIndex();
            const destIndex = edge.getDestination().getIndex();
            const sourceRow = Math.floor(sourceIndex / this.gridSize);
            const sourceCol = sourceIndex % this.gridSize;
            const destRow = Math.floor(destIndex / this.gridSize);
            const destCol = destIndex % this.gridSize;

            if (sourceRow === destRow) {
                if (sourceCol < destCol) {
                    this.maze[sourceRow][sourceCol].rightWall = false;
                    this.maze[destRow][destCol].leftWall = false;
                } else {
                    this.maze[sourceRow][sourceCol].leftWall = false;
                    this.maze[destRow][destCol].rightWall = false;
                }
            } else {
                if (sourceRow < destRow) {
                    this.maze[sourceRow][sourceCol].downWall = false;
                    this.maze[destRow][destCol].upWall = false;
                } else {
                    this.maze[sourceRow][sourceCol].upWall = false;
                    this.maze[destRow][destCol].downWall = false;
                }
            }
        }
    }
    generateMap(jsonData) {
        const json = JSON.parse(JSON.stringify(jsonData));
        const gridSize = this.gridSize;
        const gridScale = gridSize * 4 + 1;
        const groundLayer = json.layers[0];
        const wallLayer = json.layers[1];
        const exitsLayer = json.layers[2];
        this.generateMaze();
        const wallTileData = new Array((gridSize * 4 + 1) * (gridSize * 4 + 1)).fill(0);
        const exitsTileData = new Array((gridSize * 4 + 1) * (gridSize * 4 + 1)).fill(0);
        const possibleFinishIndexes = new Array();
        const possibleStartIndexes = new Array();
        const groundTileData = new Array((gridSize * 4 + 1) * (gridSize * 4 + 1)).fill(361);

        //расстановка на карте стен
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                const cell = this.maze[row][col];
                this.editCrossing(wallTileData, gridScale * 4 * row + 4 * col, row, col);
                if (cell.upWall) {
                    this.editHorizontalWall(wallTileData, gridScale * 4 * row + 2 + 4 * col);
                }
                if (cell.downWall) {
                    this.editHorizontalWall(
                        wallTileData,
                        gridScale * 4 * row + 2 + 4 * col + gridScale * 4,
                    );
                }
                if (cell.leftWall) {
                    this.editVerticalWall(
                        wallTileData,
                        gridScale * 4 * row + 4 * col + gridScale * 2,
                    );
                }
                if (cell.rightWall) {
                    this.editVerticalWall(
                        wallTileData,
                        gridScale * 4 * row + 4 * col + gridScale * 2 + 4,
                    );
                }

                if (
                    row === 0 ||
                    col === 0 ||
                    row === 0 ||
                    row === this.gridSize - 1 ||
                    col === this.gridSize - 1
                ) {
                    possibleFinishIndexes.push(gridScale * 4 * row + 2 + 4 * col + gridScale * 2);
                    //Н-П угол
                    if (col === this.gridSize - 1 && row === this.gridSize - 1) {
                        this.editCrossing(
                            wallTileData,
                            gridScale * 4 * row + 4 * col + 4 + gridScale * 4,
                            row,
                            col,
                        );
                    }
                    //правая между углами линия
                    if (col === this.gridSize - 1) {
                        this.editCrossing(
                            wallTileData,
                            gridScale * 4 * row + 4 * col + 4,
                            row,
                            col,
                        );
                    }
                    //нижняя между углами линия
                    if (row === this.gridSize - 1) {
                        this.editCrossing(
                            wallTileData,
                            gridScale * 4 * row + 4 * col + gridScale * 4,
                            row,
                            col,
                        );
                    }
                } else {
                    if (gridSize % 2 === 0) {
                        if (
                            (row === gridSize / 2 || row === gridSize / 2 - 1) &&
                            (col === gridSize / 2 || col === gridSize / 2 - 1)
                        ) {
                            possibleStartIndexes.push(
                                gridScale * 4 * row + 2 + 4 * col + gridScale * 2,
                            );
                        }
                    } else {
                        if (row === (gridSize - 1) / 2 && col === (gridSize - 1) / 2) {
                            possibleStartIndexes.push(
                                gridScale * 4 * row + 2 + 4 * col + gridScale * 2,
                            );
                        }
                    }
                }
            }
        }
        //выбор рандомных из массивов точек и расстановка их в массиве слоя земли
        const startIndex =
            possibleStartIndexes[Math.floor(Math.random() * possibleStartIndexes.length)];
        const finishIndex =
            possibleFinishIndexes[Math.floor(Math.random() * possibleFinishIndexes.length)];

        groundTileData[startIndex] = TILES_IDS.START_TILE;
        exitsTileData[finishIndex] = TILES_IDS.FINISH_TILE;
        //меняет размеры карты будущего json`a
        json.height = gridScale;
        json.width = gridScale;
        groundLayer.height = gridScale;
        groundLayer.width = gridScale;
        wallLayer.height = gridScale;
        wallLayer.width = gridScale;

        exitsLayer.height = gridScale;
        exitsLayer.width = gridScale;
        //меняет массивы слоёв будущего json`a
        wallLayer.data = wallTileData;
        groundLayer.data = groundTileData;
        exitsLayer.data = exitsTileData;

        return { json, startIndex, finishIndex };
    }

    //заолпняет горизонтальную стену 3х1 стенами
    editHorizontalWall(Array, centerIndex) {
        Array.fill(TILES_IDS.WALL_HORIZONTAL, centerIndex - 1, centerIndex + 2);
    }
    //заполняет вертикальную стену 1х3 стенами
    editVerticalWall(Array, centerIndex) {
        Array[centerIndex - (this.gridSize * 4 + 1)] = TILES_IDS.WALL_VERTICAL;
        Array[centerIndex] = TILES_IDS.WALL_VERTICAL;
        Array[centerIndex + (this.gridSize * 4 + 1)] = TILES_IDS.WALL_VERTICAL;
    }
    //заполняет перекрестие в зависимости от случая
    editCrossing(Array, crossIndex, row, col) {
        const cell = this.maze[row][col];
        //верхняя линия
        if (crossIndex < this.gridSize * 4 + 1) {
            //Л-В угол
            if (crossIndex === 0) {
                Array[crossIndex] = TILES_IDS.WALL_TWO_CORNER_LEFT_UP;
                //П-В угол
            } else if (crossIndex === this.gridSize * 4) {
                Array[crossIndex] = TILES_IDS.WALL_TWO_CORNER_RIGHT_UP;
                //верхняя между углами линия
            } else {
                if (cell.leftWall) {
                    Array[crossIndex] = TILES_IDS.WALL_THREE_DOWN;
                } else {
                    Array[crossIndex] = TILES_IDS.WALL_HORIZONTAL;
                }
            }
            //нижняя линия
        } else if (crossIndex >= (this.gridSize * 4 + 1) * this.gridSize * 4) {
            //Л-Н угол
            if (crossIndex === (this.gridSize * 4 + 1) * this.gridSize * 4) {
                Array[crossIndex] = TILES_IDS.WALL_TWO_CORNER_LEFT_DOWN;
                //П-Н угол
            } else if (crossIndex === (this.gridSize * 4 + 1) * (this.gridSize * 4 + 1) - 1) {
                Array[crossIndex] = TILES_IDS.WALL_TWO_CORNER_RIGHT_DOWN;
                //нижняя между углами линия
            } else {
                if (cell.leftWall) {
                    Array[crossIndex] = TILES_IDS.WALL_THREE_UP;
                } else {
                    Array[crossIndex] = TILES_IDS.WALL_HORIZONTAL;
                }
            }
            //левая между углами линия
        } else if (crossIndex % (this.gridSize * 4 + 1) === 0) {
            if (cell.upWall) {
                Array[crossIndex] = TILES_IDS.WALL_THREE_RIGHT;
            } else {
                Array[crossIndex] = TILES_IDS.WALL_VERTICAL;
            }
            //правая между углами линия
        } else if ((crossIndex + 1) % (this.gridSize * 4 + 1) === 0) {
            if (cell.upWall) {
                Array[crossIndex] = TILES_IDS.WALL_THREE_LEFT;
            } else {
                Array[crossIndex] = TILES_IDS.WALL_VERTICAL;
            }
            //центр
        } else {
            const upCrossWall = this.maze[row - 1][col].leftWall;
            const downCrossWall = cell.leftWall;
            const leftCrossWall = this.maze[row][col - 1].upWall;
            const rightCrossWall = cell.upWall;
            if (upCrossWall && downCrossWall && leftCrossWall && rightCrossWall) {
                Array[crossIndex] = TILES_IDS.WALL_CROSS;
            } else if (!upCrossWall && downCrossWall && leftCrossWall && rightCrossWall) {
                Array[crossIndex] = TILES_IDS.WALL_THREE_DOWN;
            } else if (upCrossWall && !downCrossWall && leftCrossWall && rightCrossWall) {
                Array[crossIndex] = TILES_IDS.WALL_THREE_UP;
            } else if (upCrossWall && downCrossWall && leftCrossWall && !rightCrossWall) {
                Array[crossIndex] = TILES_IDS.WALL_THREE_LEFT;
            } else if (upCrossWall && downCrossWall && !leftCrossWall && rightCrossWall) {
                Array[crossIndex] = TILES_IDS.WALL_THREE_RIGHT;
            } else if (!upCrossWall && downCrossWall && leftCrossWall && !rightCrossWall) {
                Array[crossIndex] = TILES_IDS.WALL_TWO_CORNER_RIGHT_UP;
            } else if (!upCrossWall && downCrossWall && !leftCrossWall && rightCrossWall) {
                Array[crossIndex] = TILES_IDS.WALL_TWO_CORNER_LEFT_UP;
            } else if (upCrossWall && !downCrossWall && leftCrossWall && !rightCrossWall) {
                Array[crossIndex] = TILES_IDS.WALL_TWO_CORNER_RIGHT_DOWN;
            } else if (upCrossWall && !downCrossWall && !leftCrossWall && rightCrossWall) {
                Array[crossIndex] = TILES_IDS.WALL_TWO_CORNER_LEFT_DOWN;
            } else if (upCrossWall && downCrossWall && !leftCrossWall && !rightCrossWall) {
                Array[crossIndex] = TILES_IDS.WALL_VERTICAL;
            } else if (!upCrossWall && !downCrossWall && leftCrossWall && rightCrossWall) {
                Array[crossIndex] = TILES_IDS.WALL_HORIZONTAL;
            } else if (upCrossWall && !downCrossWall && !leftCrossWall && !rightCrossWall) {
                Array[crossIndex] = TILES_IDS.WALL_ONE_DOWN;
            } else if (!upCrossWall && !downCrossWall && leftCrossWall && !rightCrossWall) {
                Array[crossIndex] = TILES_IDS.WALL_ONE_RIGHT;
            } else if (!upCrossWall && !downCrossWall && !leftCrossWall && rightCrossWall) {
                Array[crossIndex] = TILES_IDS.WALL_ONE_LEFT;
            } else if (!upCrossWall && downCrossWall && !leftCrossWall && !rightCrossWall) {
                Array[crossIndex] = TILES_IDS.WALL_ONE_UP;
            }
        }
    }
    inEdge(index, edge) {
        return index === edge.getDestination().getIndex() || index === edge.getSource().getIndex();
    }

    inMST(index1, index2) {
        for (const edge of this.mst) {
            if (
                (edge.getSource().getIndex() === index1 &&
                    edge.getDestination().getIndex() === index2) ||
                (edge.getSource().getIndex() === index2 &&
                    edge.getDestination().getIndex() === index1)
            ) {
                return true;
            }
        }
        return false;
    }
}
