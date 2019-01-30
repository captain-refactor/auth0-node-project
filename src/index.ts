import 'dotenv/config';
import {Server} from "./server";
import {AuthController} from "./auth-controller";
console.log(process.env.AUTH0_CLIENT_ID);

let server = new Server(new AuthController());
server.listen();
