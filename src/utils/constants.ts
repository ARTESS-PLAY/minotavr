export const TILES = {
    LABYRINTH: 'labyrinth',
};

export const SIZES = {
    TILE: {
        WIDTH: 32,
        HEIGTH: 32,
    },
    PLAYER: {
        WIDTH: 64,
        HEIGTH: 64,
    },
    GOST: {
        WIDTH: 64,
        HEIGTH: 64,
    },
    MINOTAVR: {
        WIDTH: 64,
        HEIGTH: 64,
    },
};

export const LAYERS = {
    GROUNG: 'ground',
    WALLS: 'walls',
    EXIT: 'exits',
};

export const SPRITES = {
    PLAYER: 'player',
    MINOTAVR: 'minotavr',
    GOST: 'gost',
};

export const GOST_SCREAMERS = {
    MIN_SOUND: 1,
    MAX_SOUND: 4,
    MIN_IMAGE: 1,
    MAX_IMAGE: 4,
    IMAGE: 'gostScream',
    AUDIO: 'screamAudio',
    TIME_GENERATE: 10000,
};

export const MAP_SIZE = 15;
export const MAX_GHOST = 7;

export const TilesIndexes = {
    EMPTY: -1,
    EXIT: 29,
    START: 23,
};
