import { CacheAdapter } from './cacheAdapter';
import redis from 'ioredis';

export class RedisAdapter implements CacheAdapter {
    client: any;

    constructor() {
        this.client = new redis({
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT
        });

        this.client.on('error', (err) => console.log('Redis Client Error', err));
    }

    async get(id: string) {
        return await this.client.get(id);
    }
    
    async save(id: string, data: object, ttl: number) {
        await this.client.set(id, JSON.stringify(data), 'EX', ttl);
    }
}