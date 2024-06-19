import { MinotaurMovement } from "./utils/MinotaurMovement.mjs";

const SIZE = 5;
const arr = new Array(25).fill(0);
arr[1] = 1;
arr[6] = 1;
arr[16] = 1;
arr[17] = 1;
arr[18] = 1;
arr[13] = 1;
arr[21] = 1;
//единички как стены здесь

const startX = 0;
const startY = 0;
const goalX = 2;
const goalY = 4;

const mv = new MinotaurMovement(startX, startY, goalX, goalY, SIZE, arr)
//цикл вместо тиков ю ноу
for (let i = 0; i < 20; i++){
    console.log(mv.moveMinotaur());
}

