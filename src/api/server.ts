import axios from 'axios';

const SERVERURL = 'https://minotavr-game.ru';

/**
 * Получает json карту с сервера
 */
export const getMapFromServer = async () => {
    const res = await axios.get(`${SERVERURL}/map/map.json`);

    console.log(res);
};

/**
 * Получает картинки для тайлов для карты с сервера
 */
export const getMapTiledImageFromServer = async () => {
    const res = await axios.get(`${SERVERURL}/map/durotar.jpg`);

    console.log(res);
};

// Прямая ссылка на карту с сервера
export const MAP_SERVER_JSON_URL = SERVERURL + '/map/map.json';

// Прямая ссылка на картинку для карты с сервера
export const MAP_IMAGE_SERVER_JSON_URL = SERVERURL + '/map/durotar.jpg';
