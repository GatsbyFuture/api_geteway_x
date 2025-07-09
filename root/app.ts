import Fastify, {FastifyRequest, FastifyReply, FastifyInstance} from 'fastify';
import cors from '@fastify/cors'
import httpProxy from '@fastify/http-proxy';
import jwt from '@fastify/jwt';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

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
                destination: path.join(log_path, 'app.log'),
                colorize: true,
            },
        },
    },
});

fastify.register(cors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
});

