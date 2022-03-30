"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prismaClient_1 = __importDefault(require("../prismaClient"));
class Controller {
    entity;
    prismaOptions;
    validationSchema;
    prismaClient;
    prismaEntity;
    constructor({ entity, validationSchema, prismaOptions }) {
        this.entity = entity;
        this.prismaOptions = prismaOptions;
        this.validationSchema = validationSchema; // schema de validação dos dados da entidade
        this.prismaClient = prismaClient_1.default;
        this.prismaEntity = prismaClient_1.default[entity]; // será passada a entidade na qual o controller vai agir
    }
    async store(request, response) {
        const { body } = request;
        // valida os dados de acordo com o que é passado no schema (se existir) de cada entidade (utilizando o Joi neste projeto)
        if (this.validationSchema) {
            const validation = this.validationSchema.validate(body, {
                abortEarly: false, // falso para aborta um dado de cada vez. Valida todos os dados de uma vez
            });
            // se algum dado passado estiver errado
            if (validation.error) {
                return response.status(400).json(validation.error.details);
            }
        }
        // Evitar que a aplicação quebre por erro apontado no Prisma
        try {
            const registry = await this.prismaEntity.create({
                include: this.prismaOptions?.include,
                data: body,
            });
            response.json(registry);
        }
        catch (error) {
            console.error(error);
            response.status(400).send({ message: `Failed insert: ${this.entity}` });
        }
    }
    async index(request, response) {
        const registries = await this.prismaEntity.findMany({
            include: this.prismaOptions?.include,
        });
        response.json(registries);
    }
    async update(request, response) {
        const { id } = request.params;
        const { body } = request;
        const registry = await this.prismaEntity.update({
            where: { id },
            data: body,
        });
        response.json(registry);
    }
    async remove(request, response) {
        const { id } = request.params;
        await this.prismaEntity.delete({ where: { id } });
        response.json({ message: `${this.entity.toUpperCase()} removed` });
    }
    async getOne(request, response) {
        const { id } = request.params;
        const registry = await this.prismaEntity.findUnique({ where: { id } });
        response.json(registry);
    }
}
exports.default = Controller;
