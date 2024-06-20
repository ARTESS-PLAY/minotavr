import axios from 'axios';
import { MAP_SIZE } from '../utils/constants';

const SERVERURL = 'https://minotavr-game.ru';
// const SERVERURL = 'http://localhost:3005';

/**
 * Получает json карту с сервера
 */
export const getMapFromServer = async () => {
    const res = await axios.get(`${SERVERURL}/generate_map?size=${MAP_SIZE}`);

    return res.data;
};

// Прямая ссылка на картинку для карты с сервера
export const MAP_IMAGE_SERVER_JSON_URL = SERVERURL + '/map/durotar.jpg';
