import {AuthenticationClient} from "auth0";
import * as Router from "koa-router";
import * as bodyParser from "koa-bodyparser";

export class AuthController {
    constructor(private client: AuthenticationClient) {
    }

    async login(username: string, password: string) {
        return await this.client.passwordGrant({username, password})
    }

    router(): Router {
        return new Router()
            .use(bodyParser() as any)
            .get('/login',context => {
                context.response.body = 'login';
            })
            .post('/login', async context => {
                const {username, password} = context.request.body;
                let result = await this.login(username, password);
                console.log(result);
                context.response.body = result;
            })
    }
}
