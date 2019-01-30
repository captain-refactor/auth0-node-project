import 'dotenv/config';
import {Server} from "./server";
import {AuthController} from "./auth-controller";
import {AuthenticationClient} from "auth0";

const {
    AUTH0_CLIENT_ID,
    AUTH0_DOMAIN,
    AUTH0_CLIENT_SECRET
} = process.env;

let server = new Server(new AuthController(new AuthenticationClient({
    clientId: AUTH0_CLIENT_ID,
    clientSecret: AUTH0_CLIENT_SECRET,
    domain: AUTH0_DOMAIN
})));
server.listen();
