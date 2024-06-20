import { MinotaurMovement } from "./utils/MinotaurMovement.mjs";

const start= new Date().getTime();
const SIZE = 5;
const arr = new Array(25).fill(0);
arr[9] = 1;
arr[14] = 1;
arr[19] = 1;
arr[24] = 1;
arr[5] = 1;
arr[10] = 1;
arr[15] = 1;
arr[20] = 1;
//единички как стены здесь

let startX = 4;
let startY = 0;
const goalX = 3;
const goalY = 4;

const mv = new MinotaurMovement(SIZE, arr)
//цикл вместо тиков ю ноу
for (let i = 0; i < 20; i++){
    console.time('FirstWay');
    let move = mv.moveMinotaur(startX, startY, goalX, goalY);
    console.timeEnd('FirstWay');
    console.log(move.direction, move.isRunning);
    if (move.direction === 'left'){
        startX -= 1
    } else if(move.direction === 'right'){
        startX += 1
    } else if(move.direction === 'up'){
        startY -= 1
    } else if(move.direction === 'down'){
        startY += 1
    }
}




