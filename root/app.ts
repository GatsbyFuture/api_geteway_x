import Fastify, {FastifyRequest, FastifyReply, FastifyInstance} from 'fastify';
import cors from '@fastify/cors'
import httpProxy from '@fastify/http-proxy';
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
    upstream: 'http://localhost:5250',
    prefix: '/main',
    rewritePrefix: '',
});

fastify.register(httpProxy, {
    upstream: 'http://localhost:5350',
    prefix: '/call',
    rewritePrefix: '',
});

fastify.register(httpProxy, {
    upstream: 'http://localhost:5450',
    prefix: '/report',
    rewritePrefix: '',
});

fastify.get('/', async (_request: FastifyRequest, reply: FastifyReply) => {
    return reply.code(200).send({
        success: true,
        message: 'All right!',
    });
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