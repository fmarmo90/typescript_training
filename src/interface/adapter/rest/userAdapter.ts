import fetch from 'node-fetch';
import config from 'config';
import RedisAdapter from '../cache/redisAdapter';
import CacheAdapter from '../cache/cacheAdapter';
import RestAdapter from './restAdapter';

export default class UserAdapter implements RestAdapter {
    private cacheAdapter: CacheAdapter;

    constructor() {
        this.cacheAdapter = RedisAdapter.getInstance();
    }

    async get(phone: string) {
        try {
            let apiResult: UserApiResponse = null;

            if (await this.cacheAdapter.get(phone)) {
                apiResult = JSON.parse(await this.cacheAdapter.get(phone));
            } else {
                const apiUrl = config.get('dependencies.userApi.url').replace('#phone', encodeURI(phone));
                const response: any = await fetch(apiUrl);
                
                apiResult = await response.json();

                await this.cacheAdapter.save(phone, apiResult, config.get('cache.ttl'));
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