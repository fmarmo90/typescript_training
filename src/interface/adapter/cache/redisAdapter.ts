import CacheAdapter from './cacheAdapter';
import redis from 'ioredis';

export default class RedisAdapter implements CacheAdapter {
    private static _instance;
    private client;

    private constructor() {
        this.client = new redis({
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT
        });

        this.client.on('error', (err) => console.log('Redis Client Error', err));
    }

    public static getInstance(): any {
        return this._instance || (this._instance = new RedisAdapter());
    }

    async get(id: string) {
        return await this.client.get(id);
    }
    
    async save(id: string, data: object, ttl: number) {
        await this.client.set(id, JSON.stringify(data), 'EX', ttl);
    }
}