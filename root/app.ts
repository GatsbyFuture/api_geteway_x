import Fastify, {FastifyRequest, FastifyReply, FastifyInstance} from 'fastify';
import cors from '@fastify/cors'
import httpProxy from '@fastify/http-proxy';
import jwt from '@fastify/jwt';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import jwtPlugin from './plugins/jwt';

dotenv.config();

const log_path = path.join(__dirname, 'logs');
if (!fs.existsSync(log_path)) {
    fs.mkdirSync(log_path, {recursive: true});
}

const fastify: FastifyInstance = Fastify({
    logger: {
        level: 'info',
        transport: {
            target: 'pino-pretty',
            options: {
                colorize: true,
                translateTime: 'HH:MM:ss Z',
                destination: path.join(log_path, 'app.log'),
            },
        },
    },
});

fastify.register(cors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
});

fastify.register(jwtPlugin);

fastify.register(httpProxy, {
    upstream: 'http://localhost:8001',
    prefix: '/main',
    rewritePrefix: '',
});

fastify.register(httpProxy, {
    upstream: 'http://localhost:8002',
    prefix: '/call',
    rewritePrefix: '',
});

fastify.register(httpProxy, {
    upstream: 'http://localhost:8003',
    prefix: '/report',
    rewritePrefix: '',
});

const start = async () => {
    try {
        const port: number = parseInt(process.env.PORT || '5150', 10);
        await fastify.listen({port: port});
        console.log('listening to port ' + port);
    } catch (e) {
        fastify.log.error(e);
        process.exit(1);
    }
}

(async () => {
    await start();
})();