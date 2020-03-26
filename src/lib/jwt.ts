import jwt from 'jsonwebtoken';
import { SECRET } from '../config/environment';

export default class Jwt {

    constructor() {

    }

    async getUser(token: string): Promise<{ status: boolean, user: any }> {
        try {
            const user = await jwt.verify(token, SECRET);
            return {
                status: true,
                user
            }
        } catch (error) {
            return {
                status: false,
                user: null
            }
        }
    }

}

