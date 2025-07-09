"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.default = (0, fastify_plugin_1.default)(async (fastify) => {
    fastify.register(jwt_1.default, {
        secret: process.env.JWT_SECRET || 'default-secret',
    });
    // fastify.addHook...
    fastify.addHook('onRequest', async (req, reply) => {
        if (req.url.startsWith('/user/login') ||
            req.url.startsWith('/user/register'))
            return;
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return reply.code(401).send({ error: 'Token required' });
        }
        const token = authHeader.split(' ')[1];
        try {
            const decoded = fastify.jwt.verify(token);
            req.headers['x-user-id'] = decoded.user_id;
            req.headers['x-user-role'] = decoded.role;
        }
        catch {
            return reply.code(401).send({ error: 'Invalid token' });
        }
    });
});
