export type Directions = {
    up: boolean;
    left: boolean;
    down: boolean;
    right: boolean;
};

export type MovementData = Directions & { isRunning: boolean };
