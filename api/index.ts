import express, { Request, Response } from 'express';
import cors from 'cors';
import { config } from '../src/serverConfig';
import { getLbayrinth } from '../src/controllers/labyrinth';

/* CONFIGURATE APP */
const app = express();
app.use(express.json());
app.use(cors());

// Статические файлы для карты
// app.use('/map', express.static(`${__dirname}/../public`));

/* CONFIGURATE APP END*/

app.get('/', textExample);

app.get('/generate_map', getLbayrinth);

function textExample(req: Request, res: Response) {
    res.send('hello!');
}

export default app;
