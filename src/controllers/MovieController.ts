import Controller from './Controller';
import Joi from 'joi';
import prisma from '@prisma/client';

const { ParentalGuidance } = prisma;

// schema para que dados passados sejam validados de acordo com as regras dadas
const schema = Joi.object({
  parental_guidance: Joi.string()
    .required()
    .valid(...Object.values(ParentalGuidance)), // pega valores do Parental_Guidance diretamente do schema do Prisma
  languages: Joi.array().items(Joi.string()),
  director: Joi.string().required().min(3).max(50),
  name: Joi.string().required(),
  duration: Joi.number().integer().positive().max(500),
  thumbnail: Joi.string().allow(''),
  rating: Joi.number().max(10),
  description: Joi.string().required().max(10000),
});

class MovieController extends Controller {
  constructor() {
    super({ entity: 'movie', validationSchema: schema });
  }
}
export default MovieController;
