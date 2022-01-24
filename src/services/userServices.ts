import fetch from 'node-fetch';
import config from 'config';
import redis from 'ioredis';

export class UserService {
    static client: any;
    
    static async startCache() {
        this.client = new redis({
            host: process.env.REDIS_HOST,
            port: 6379
        });

        this.client.on('error', (err) => console.log('Redis Client Error', err));
    }

    static async getInfo(phone: string) : Promise<User> {
        try {
            let apiResult: UserApiResponse = null;

            await this.startCache();

            if (await this.client.get(phone)) {
                apiResult = JSON.parse(await this.client.get(phone));
            } else {
                const apiUrl = config.get('dependencies.userApi.url').replace('#phone', encodeURI(phone));
                const response: any = await fetch(apiUrl);
                
                apiResult = await response.json();

                await this.client.set(phone, JSON.stringify(apiResult), 'EX', 300);
            }

            return {
                phone: apiResult.phone_number,
                address: apiResult.address,
                name: apiResult.name,
                firendsList: apiResult.friends
            }
        } catch (err) {
            throw err;
        }
    }
}