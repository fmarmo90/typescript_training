import RestAdapter from './restAdapter';
import fetch from 'node-fetch';
import config from 'config';
import { RedisAdapter } from '../cache/redisAdapter';

export default class UserAdapter implements RestAdapter {
    async get(phone: string) {
        try {
            let apiResult: UserApiResponse = null;

            const cache = new RedisAdapter();

            if (await cache.get(phone)) {
                apiResult = JSON.parse(await cache.get(phone));
            } else {
                const apiUrl = config.get('dependencies.userApi.url').replace('#phone', encodeURI(phone));
                const response: any = await fetch(apiUrl);
                
                apiResult = await response.json();

                await cache.save(phone, apiResult, config.get('cache.ttl'));
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