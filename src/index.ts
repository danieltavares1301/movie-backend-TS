import express, { Express } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import router from './routes/index';

dotenv.config();

const PORT = process.env.PORT;

class App {
  public express: Express

  constructor() {
    this.express = express()

    // inicializando funções
    this.initializeMiddlewares()
    this.initializeRoutes()
  }

  private initializeMiddlewares(): void {
    this.express.use(express.json()); // para que se possa passar jsons no body de requisições
    this.express.use(morgan('dev'));
    this.express.use(helmet()); // executa a parte de segurança
    this.express.use(cors()); // define uma política no qual o browser saberá de onde ele requisitará aquela informação
  }

  private initializeRoutes(): void {
    this.express.get('/', (resquest, response) => {
      response.json({ message: 'Hello World' });
    });

    this.express.use('/api', router);
  }

  public listen(): void {
    this.express.listen(PORT, () => {
      console.log(`Server running PORT: ${PORT}`);
    });
  }
}

const app = new App()

app.listen()

// teste
