"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Controller_1 = __importDefault(require("./Controller"));
const joi_1 = __importDefault(require("joi"));
const client_1 = __importDefault(require("@prisma/client"));
const { ParentalGuidance } = client_1.default;
// schema para que dados passados sejam validados de acordo com as regras dadas
const schema = joi_1.default.object({
    parental_guidance: joi_1.default.string()
        .required()
        .valid(...Object.values(ParentalGuidance)),
    languages: joi_1.default.array().items(joi_1.default.string()),
    director: joi_1.default.string().required().min(3).max(50),
    name: joi_1.default.string().required(),
    duration: joi_1.default.number().integer().positive().max(500),
    thumbnail: joi_1.default.string().allow(''),
    rating: joi_1.default.number().max(10),
    description: joi_1.default.string().required().max(10000),
});
class MovieController extends Controller_1.default {
    constructor() {
        super({ entity: 'movie', validationSchema: schema });
    }
}
exports.default = MovieController;
