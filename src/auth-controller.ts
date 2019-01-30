import {AuthenticationClient} from "auth0";
import * as Router from "koa-router";
import * as bodyParser from "body-parser";

export class AuthController {
    constructor(private client: AuthenticationClient) {
    }

    async login(username: string, password: string) {
        return await this.client.passwordGrant({username, password})
    }

    router(): Router {
        return new Router()
            .use(bodyParser() as any)
            .post('/login', context => {
                const {username, password} = context.request.body;
                console.log(username);
                console.log(password);
            })
    }
}
