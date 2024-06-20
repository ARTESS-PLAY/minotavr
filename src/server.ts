import express, { Request, Response } from 'express';
import cors from 'cors';
import { config } from './serverConfig';
import { getLbayrinth } from './controllers/labyrinth';

/* CONFIGURATE APP */
const app = express();
app.use(express.json());
app.use(cors());

// Статические файлы для карты
app.use('/map', express.static(`${__dirname}/../public`));

app.listen(config.port, () => {
    console.log(`Listening port ${config.port}`);
});
/* CONFIGURATE APP END*/

app.get('/', textExample);

app.get('/generate_map', getLbayrinth);

function textExample(req: Request, res: Response) {
    res.send('hello!');
}
