"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const index_1 = __importDefault(require("./routes/index"));
dotenv_1.default.config();
const PORT = process.env.PORT;
const app = (0, express_1.default)();
app.use(express_1.default.json()); // para que se possa passar jsons no body de requisições
app.use((0, morgan_1.default)('dev'));
app.use((0, helmet_1.default)()); // executa a parte de segurança
app.use((0, cors_1.default)()); // define uma política no qual o browser saberá de onde ele requisitará aquela informação
app.use('/api', index_1.default);
app.get('/', (resquest, response) => {
    response.json({ message: 'Hello World' });
});
app.listen(PORT, () => {
    console.log(`Server running PORT: ${PORT}`);
});
// teste
