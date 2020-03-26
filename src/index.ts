import Server from "./server";
import connection from "./config/database";


const server=Server.instance;
connection();
server.start()