"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const serverConfig_1 = require("./serverConfig");
/* CONFIGURATE APP */
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Статические файлы для карты
app.use('/map', express_1.default.static(`${__dirname}/../public`));
app.listen(serverConfig_1.config.port, () => {
    console.log(`Listening port ${serverConfig_1.config.port}`);
});
/* CONFIGURATE APP END*/
app.get('/', textExample);
function textExample(req, res) {
    res.send('hello!');
}
//# sourceMappingURL=server.js.map