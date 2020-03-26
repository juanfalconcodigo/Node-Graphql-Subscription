import { IResolvers } from 'graphql-tools';
import bcrypt from 'bcrypt';
import { User } from '../models/user';
import { Publication } from '../models/publication';
import { Vote } from '../models/vote';
import { getPublication } from '../lib/operation';
import { PubSub } from 'apollo-server-express';
import { CHANGE_VOTES } from '../config/environment';

//para el Subscription
async function sendNotification(pubsub: PubSub) {
    pubsub.publish(CHANGE_VOTES, { changeVotes: await getPublication() });
}

const mutation: IResolvers = {
    Mutation: {

        async createUser(__: void, { user }): Promise<any> {

            const userFind: any = await User.findOne({ email: user.email });
            if (userFind !== null) {
                return {
                    status: false,
                    message: `Ya existe un usuario con el email: ${user.email}`,
                    user: null
                }
            }
            try {
                const newUser = new User({
                    ...user,
                    password: bcrypt.hashSync(user.password, 10)
                });
                const saveUser = await newUser.save();
                return {
                    status: true,
                    message: `Usuario registrado exitosamente`,
                    user: saveUser
                }
            } catch (err) {
                return {
                    status: false,
                    message: `Error en la petición`,
                    user: null
                }
            }
        },
        async deleteUser(__: void, { id }): Promise<any> {

            try {
                const user = await User.findByIdAndRemove(id);
                if (user === null) {
                    return {
                        status: false,
                        message: `No existe un usuario con el id :${id}`,
                        user: null
                    }
                }
                return {
                    status: true,
                    message: `Se elimino correctamente el usuario`,
                    user
                }
            } catch (err) {
                return {
                    status: false,
                    message: `No existe un usuario con el id :${id}`,
                    user: null
                }

            }
        },
        async updateUser(_: void, { id, user }): Promise<{ status: boolean, message: string, user: any }> {
            try {
                const data = {
                    ...user,
                    password: bcrypt.hashSync(user.password, 10)
                }
                const putUser: any = await User.findByIdAndUpdate(id, data, { new: true, runValidators: true, context: "query" });
                return {
                    status: true,
                    message: `Se actualizo exitosamente al usuario : ${putUser.name}`,
                    user: putUser
                }

            } catch (err) {
                return {
                    status: false,
                    message: `No existe un usuario con el id : ${id}`,
                    user: null
                }
            }
        },
        async createPublication(_: void, { publication }, { pubsub }): Promise<any> {
            const newPublication = new Publication({
                ...publication
            });
            try {
                const savePublication = await newPublication.save();
                const user = await User.findById(savePublication.user);
                /* console.log({...savePublication,user}); */
                const { _id, description, img, createAt } = savePublication;
                await sendNotification(pubsub);
                return {
                    status: true,
                    message: `Se registro correctamente su publicación`,
                    publication: { _id, description, img, createAt, user }
                }
            } catch (err) {
                return {
                    status: false,
                    message: `Huvo un error en la petición intentelo nuevamente`,
                    publication: null
                }
            }
        },
        async updatePublication(_: void, { id, publication }): Promise<any> {
            try {
                const putPublication = await Publication.findByIdAndUpdate(id, { ...publication }, { context: 'query', runValidators: true, new: true }).populate('user');
                return {
                    status: true,
                    message: `Se actualizo correctamente la publicación`,
                    publication: putPublication
                }
            } catch (error) {
                return {
                    status: false,
                    message: `La petición fue realizada incorrectamente verique sus datos!!!`,
                    publication: null
                }
            }
        },
        async deletePublication(_: void, { id }, { pubsub }): Promise<any> {
            try {
                const publication = await Publication.findByIdAndRemove(id).populate('user');
                if (publication === null) {
                    return {
                        status: false,
                        message: `No existe una publicación con el id : ${id}`,
                        publication: null
                    }
                }
                await sendNotification(pubsub);
                return {
                    status: true,
                    message: `Se elimino correctamente la publicación`,
                    publication
                }
            } catch (err) {
                return {
                    status: false,
                    message: `No existe una publicación con el id : ${id}`,
                    publication: null
                }
            }
        },
        async createVote(_: void, { idPublication, idUser }, { pubsub }): Promise<any> {
            const validateVotePublicationUser = await Vote.find({ publication: idPublication, user: idUser });
            //console.log(validateVotePublicationUser)
            if (validateVotePublicationUser.length !== 0) {
                return {
                    status: false,
                    message: `Solo puede emitir un voto`,
                    vote: null
                }
            }

            const vote = new Vote({
                publication: idPublication,
                user: idUser
            });

            try {
                const publication = await Publication.findById(idPublication);
                const user = await User.findById(idUser);

                const newVote = await vote.save();
                const { _id } = newVote;
                //como socketio
                await sendNotification(pubsub);
                return {
                    status: true,
                    message: `Se registro correctamente su voto`,
                    vote: {
                        _id,
                        publication,
                        user
                    }
                }
            } catch (err) {
                return {
                    status: false,
                    message: `Error en la petición intentelo nuevamente`,
                    vote: null
                }
            }
        },
        async updateVote(_: void, { idPublication, idUser }): Promise<any> {
            return {
                status: false,
                message: `No le encuentro utilidad por ahora`,
                vote: null
            }
        },
        async deleteVote(_: void, { idPublication, idUser }, { pubsub }): Promise<any> {

            try {
                const voteFind = await Vote.findOne({ publication: idPublication, user: idUser });
                if (voteFind === undefined || voteFind === null) {
                    return {
                        status: false,
                        message: `No existe ese voto`,
                        vote: null
                    }
                }
                const { _id } = voteFind;

                const delVote = await Vote.findByIdAndRemove(_id).populate('publication').populate('user');

                if (delVote === null) {
                    return {
                        status: false,
                        message: `No existe un voto con el id : ${_id}`,
                        vote: null
                    }
                }
                await sendNotification(pubsub);
                return {
                    status: true,
                    message: `Se eliminó su voto exitosamente`,
                    vote: delVote
                }
            } catch (err) {
                return {
                    status: false,
                    message: `Huvo un error en la petición , inténtelo nuevamente`,
                    vote: null
                }
            }
        }
    }

}

export default mutation;