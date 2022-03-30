import Controller from './Controller';
import Joi from 'joi';
import * as prisma from '@prisma/client';
import { Request, Response } from 'express';

const { TicketType } = prisma;

const schema = Joi.object({
  price: Joi.number().required().precision(2),
  type: Joi.string()
    .required()
    .valid(...Object.values(TicketType)),
  // lógica para conseguir passar um id de uma session
  session: Joi.object({
    connect: Joi.object({
      id: Joi.string().required(),
    }),
  }),
  // lógica para conseguir passar um id de um user
  user: Joi.object({
    connect: Joi.object({
      id: Joi.string().required(),
    }),
  }),
});

class TicketController extends Controller {
  constructor() {
    super({
      entity: 'ticket',
      validationSchema: schema,
      prismaOptions: {
        include: {
          session: { include: { movie: true } },
          user: true,
        },
      },
    });
  }

  async store(request: Request, response: Response) {
    // pega novos sessionId e userId
    const { sessionId, userId } = request.body;

    // apaga os antigos do body
    delete request.body.sessionId;
    delete request.body.userId;

    // usado para visualizar a lógica de como é incluso no request.body
    //
    //this.prismaClient.session.create({
    //  data: { Session: { createMany: { data: this.generateSeats() } } },
    //});

    request.body = {
      ...request.body,
      // transforma novo movieId no movieId que será utilizado
      session: {
        connect: {
          id: sessionId,
        },
      },
      user: {
        connect: {
          id: userId,
        },
      },
    };
    super.store(request, response);
  }
}

export default TicketController;
