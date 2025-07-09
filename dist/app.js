"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const http_proxy_1 = __importDefault(require("@fastify/http-proxy"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const jwt_1 = __importDefault(require("./plugins/jwt"));
dotenv_1.default.config();
const log_path = path_1.default.join(__dirname, 'logs');
if (!fs_1.default.existsSync(log_path)) {
    fs_1.default.mkdirSync(log_path, { recursive: true });
}
const fastify = (0, fastify_1.default)({
    logger: {
        level: 'info',
        transport: {
            target: 'pino-pretty',
            options: {
                destination: path_1.default.join(log_path, 'app.log'),
                colorize: true,
            },
        },
    },
});
fastify.register(cors_1.default, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
});
fastify.register(jwt_1.default);
fastify.register(http_proxy_1.default, {
    upstream: 'http://localhost:8001',
    prefix: '/main',
    rewritePrefix: '',
});
fastify.register(http_proxy_1.default, {
    upstream: 'http://localhost:8002',
    prefix: '/call',
    rewritePrefix: '',
});
fastify.register(http_proxy_1.default, {
    upstream: 'http://localhost:8003',
    prefix: '/report',
    rewritePrefix: '',
});
const start = async () => {
    try {
        const port = parseInt(process.env.PORT || '5050', 10);
        await fastify.listen({ port: port });
    }
    catch (e) {
        fastify.log.error(e);
        process.exit(1);
    }
};
(async () => {
    await start();
})();
