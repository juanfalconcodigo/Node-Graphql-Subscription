import mongoose from 'mongoose';
import { URL_DB } from './environment';


const connection = async () => {
    try {
        const db = await mongoose.connect(URL_DB, { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false });
        console.log(`<<<<<<<<<< Conexión exitosa >>>>>>>>>>`);
    } catch (error) {
        console.log(`Hubo un error en la conexión`);
    }

}

export default connection;