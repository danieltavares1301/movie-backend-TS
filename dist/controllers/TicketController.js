"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Controller_1 = __importDefault(require("./Controller"));
const joi_1 = __importDefault(require("joi"));
const prisma = __importStar(require("@prisma/client"));
const { TicketType } = prisma;
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
