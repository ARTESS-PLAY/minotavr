/**
 * Функция красиво выводит время
 *
 * @param time - секунды
 */

export function getCuteTime(time: number) {
    // Получаем часы
    const hours = Math.floor(time / 3600);

    // Получаем минуты
    const minutes = Math.floor((time - hours * 3600) / 60);

    // Получаем секунды
    const seconds = time - hours * 3600 - minutes * 60;

    return `${String(hours).length == 1 ? '0' + hours : hours}:${
        String(minutes).length == 1 ? '0' + minutes : minutes
    }:${String(Math.floor(seconds)).length == 1 ? '0' : ''}${seconds.toFixed(2)}`;
}

export function randomInteger(min: number, max: number) {
    // случайное число от min до (max+1)
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}
