import { Request, Response } from 'express';
import { generateJsonMap } from '../mapGeneration/Main';

/**
 * Функция нужна чтобы сгенерировать и отдать лабиритн
 */
export function getLbayrinth(req: Request, res: Response) {
    // Размер карты
    const size = req.query.size;

    const result = generateJsonMap(Number(size));

    res.setHeader('Content-Type', 'application/json');
    res.send(result);
}
