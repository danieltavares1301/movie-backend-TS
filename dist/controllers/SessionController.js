"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = __importDefault(require("@prisma/client"));
const joi_1 = __importDefault(require("joi"));
const Controller_1 = __importDefault(require("./Controller"));
const { Room, SeatType, SeatStatus } = client_1.default;
const schema = joi_1.default.object({
    sessionDate: joi_1.default.date().required(),
    room: joi_1.default.string()
        .required()
        .valid(...Object.values(Room)),
    caption: joi_1.default.boolean().required(),
    // lógica para conseguir passar um id de um movie
    movie: joi_1.default.object({
        connect: joi_1.default.object({
            id: joi_1.default.string().required(),
        }),
    }),
    SessionSeats: joi_1.default.any(), // seu valor já é controlado em outra função
});
class SessionController extends Controller_1.default {
    excludeColumns;
    maxOfColumns;
    maxOfRows;
    constructor() {
        super({
            entity: 'session',
            validationSchema: schema,
            // faz com que entidades apareçam no response
            prismaOptions: {
                include: {
                    movie: true,
                    Ticket: true,
                    SessionSeats: true,
                },
            },
        });
        // seats que desejo retirar
        this.excludeColumns = [
            { line: 'A', columns: [1, 3] },
            { line: 'B', columns: [3] },
        ];
        this.maxOfColumns = 5;
        this.maxOfRows = 5;
    }
    generateSeats() {
        const seats = [];
        // alfabeto para representar linhas
        const alphabet = [
            'A',
            'B',
            'C',
            'D',
            'E',
            'F',
            'G',
            'H',
            'I',
            'J',
            'K',
            'L',
            'M',
            'N',
            'O',
            'P',
            'Q',
            'R',
            'S',
            'T',
            'U',
            'V',
            'W',
            'X',
            'Y',
            'Z',
        ];
        // lógica de uma matriz
        for (let x = 0; x < this.maxOfRows; x++) {
            for (let y = 0; y < this.maxOfColumns; y++) {
                const column = y + 1;
                const line = alphabet[x];
                // retorna verdadeiro se linha e coluna forem iguais as da constante que define anteriormente
                const isExclude = this.excludeColumns.find((excludeColumns) => excludeColumns.columns.includes(column) &&
                    excludeColumns.line === line);
                // se verdadeiro, não acrescentará a lista de seats
                if (isExclude) {
                    continue;
                }
                // acréscimo de linhas, colunas, tipo (apenas STANDARD nesta lógica) e status (apenas AVAILABLE)
                seats.push({
                    line,
                    column,
                    type: SeatType.STANDARD,
                    status: SeatStatus.AVAILABLE,
                });
            }
        }
        // retorna a lista
        return seats;
    }
    async store(request, response) {
        // faz novo movieId
        const movieId = request.body.movieId;
        // apaga movieId do body
        delete request.body.movieId;
        // usado para visualizar a lógica de como é incluso no request.body
        //
        //this.prismaClient.session.create({
        //  data: { SessionSeats: { createMany: { data: this.generateSeats() } } },
        //});
        request.body = {
            ...request.body,
            // transforma novo movieId no movieId que será utilizado
            movie: {
                connect: {
                    id: movieId,
                },
            },
            // será a lista que a função de gerar assentos retorna
            SessionSeats: { createMany: { data: this.generateSeats() } },
        };
        super.store(request, response);
    }
}
exports.default = SessionController;
