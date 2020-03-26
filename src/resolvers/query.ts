import { IResolvers } from 'graphql-tools';
import { User } from '../models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Publication } from '../models/publication';
import { SECRET } from '../config/environment';

const query: IResolvers = {
    Query: {
        hello(): string {

            return "Hello";

        },
        async users(_: void, __: any): Promise<any> {
            try {
                const users = User.find({});
                return users;
            } catch (err) {
                console.log("hay error");
            }
        },
        async login(_: void, { email, password }) {

            const userFind = await User.findOne({ email });
            if (userFind === null) {
                return {
                    status: false,
                    message: `Usuario no registrado`,
                    user: null,
                    token: null
                }
            }

            if (!bcrypt.compareSync(password, userFind.password)) {
                return {
                    status: false,
                    message: `Verifique sus datos`,
                    user: null,
                    token: null
                }
            }

            userFind.password = await "No veras el password tienes que estudiar más todavía";
            const token = await jwt.sign({ user: userFind }, SECRET, { expiresIn: '1h' });

            return {
                status: true,
                message: `Ingreso exitoso`,
                user: userFind,
                token
            }

        },
        async me(_: void, __: any, { user }): Promise<{ status: boolean, message: string, user: any }> {
            if (user === null) {
                return {
                    status: false,
                    message: `No se encontro al usuario , token incorrecto`,
                    user: null
                }
            }
            return {
                status: true,
                message: `Se encontro al usuario`,
                user: user.user
            }
        },
        async publications(_: void, __: any): Promise<any> {
            try {
                const publications = await Publication.find({}).sort({ createAt: -1 }).populate('user');
                return publications;
            } catch (error) {
                console.log('Huvo un error');
            }
        }
    }

}

export default query;