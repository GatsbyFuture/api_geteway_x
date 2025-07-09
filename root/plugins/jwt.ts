import fp from 'fastify-plugin';
import fastifyJwt from '@fastify/jwt';
import {FastifyRequest, FastifyReply} from "fastify";
import dotenv from 'dotenv';
import {JwtPayload} from "../interface/jwt.payload";

dotenv.config();

export default fp(async (fastify) => {
    fastify.register(fastifyJwt, {
        secret: process.env.JWT_SECRET || 'default-secret',
    });

    // fastify.addHook...
    fastify.addHook('onRequest', async (req: FastifyRequest, reply: FastifyReply) => {
        if (
            req.url.startsWith('/user/login') ||
            req.url.startsWith('/user/register')
        ) return;

        const authHeader = req.headers['authorization'];

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return reply.code(401).send({error: 'Token required'});
        }

        const token = authHeader.split(' ')[1];

        try {
            const decoded = fastify.jwt.verify<JwtPayload>(token);
            req.headers['x-user-id'] = decoded.user_id;
            req.headers['x-user-role'] = decoded.role;
        } catch {
            return reply.code(401).send({error: 'Invalid token'});
        }
    });
});