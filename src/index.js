import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import router from './routes/index.js';

dotenv.config();

const PORT = process.env.PORT;

const app = express();

app.use(express.json()); // para que se possa passar jsons no body de requisições
app.use(morgan('dev'));
app.use(helmet()); // executa a parte de segurança
app.use(cors()); // define uma política no qual o browser saberá de onde ele requisitará aquela informação

app.use('/api', router);

app.get('/', (resquest, response) => {
  response.json({ message: 'Hello World' });
});

app.listen(PORT, () => {
  console.log(`Server running PORT: ${PORT}`);
});

// teste
