const PORT: number = Number(process.env.PORT) || 5200;
const PROCESS_ENV_PROD: string = process.env.NODE_ENV || 'dev';
let URL_DB: string;

if (PROCESS_ENV_PROD === 'dev') {
    URL_DB = 'mongodb://localhost:27017/me';
} else {
    URL_DB = String(process.env.MONGO_URI);
}

const SECRET: string = process.env.SECRET || `SECRET_KEY_LOCALHOST`;

const CHANGE_VOTES: string = 'CHANGE_VOTES';

export {
    PORT,
    CHANGE_VOTES,
    SECRET,
    URL_DB
}