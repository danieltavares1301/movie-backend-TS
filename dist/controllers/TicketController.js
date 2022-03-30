"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Controller_1 = __importDefault(require("./Controller"));
const joi_1 = __importDefault(require("joi"));
const client_1 = __importDefault(require("@prisma/client"));
const { TicketType } = client_1.default;
const schema = joi_1.default.object({
    price: joi_1.default.number().required().precision(2),
    type: joi_1.default.string()
        .required()
        .valid(...Object.values(TicketType)),
    // lógica para conseguir passar um id de uma session
    session: joi_1.default.object({
        connect: joi_1.default.object({
            id: joi_1.default.string().required(),
        }),
    }),
    // lógica para conseguir passar um id de um user
    user: joi_1.default.object({
        connect: joi_1.default.object({
            id: joi_1.default.string().required(),
        }),
    }),
});
class TicketController extends Controller_1.default {
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
    async store(request, response) {
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
exports.default = TicketController;
