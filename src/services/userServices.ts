import fetch from 'node-fetch';

export class UserService {
    static async getInfo(phone: string) : Promise<User> {
        try {
            const apiUrl = `https://interview-brubank-api.herokuapp.com/users/${encodeURI(phone)}`;
            const response: any = await fetch(apiUrl);
            const apiResult: UserApiResponse = await response.json();
            
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