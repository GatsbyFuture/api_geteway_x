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
    origin: (origin, cb) => {
        cb(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false
});

fastify.register(jwtPlugin);

fastify.register(httpProxy, {
    upstream: 'http://localhost:5050',
    prefix: '/main',
    rewritePrefix: '',
});

fastify.register(httpProxy, {
    upstream: 'http://localhost:5100',
    prefix: '/client',
    rewritePrefix: '',
});

fastify.register(httpProxy, {
    upstream: 'http://localhost:5150',
    prefix: '/call',
    rewritePrefix: '',
});

fastify.register(httpProxy, {
    upstream: 'http://localhost:5200',
    prefix: '/report',
    rewritePrefix: '',
});

fastify.register(httpProxy, {
    upstream: 'http://localhost:5250',
    prefix: '/kanban',
    rewritePrefix: '',
});

fastify.register(httpProxy, {
    upstream: 'http://localhost:5300',
    prefix: '/crm',
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
        const port: number = parseInt(process.env.PORT || '5001', 10);
        await fastify.listen({port: port, host: '0.0.0.0'});
        console.log('listening to port ' + port);
    } catch (e) {
        fastify.log.error(e);
        process.exit(1);
    }
}

(async () => {
    await start();
})();