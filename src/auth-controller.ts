import {AuthenticationClient} from "auth0";
import * as Router from "koa-router";
import * as bodyParser from "koa-bodyparser";
import jwt = require('koa-jwt');
import jwks = require('jwks-rsa');

export interface AuthConfig {
    issuer: string;
    audience: string;
    jwksUri: string
}

export class AuthController {
    constructor(private client: AuthenticationClient, private config: AuthConfig) {
    }

    async login(username: string, password: string) {
        return await this.client.passwordGrant({username, password})
    }

    router(): Router {
        const cookie = 'token';
        const checkJwt = jwt({
            // @ts-ignore
            secret: jwks.koaJwtSecret({
                cache: true,
                rateLimit: true,
                jwksRequestsPerMinute: 5,
                jwksUri: this.config.jwksUri
            }),
            audience: this.config.audience,
            issuer: this.config.issuer,
            algorithms: ['RS256'],
            cookie: cookie
        });
        return new Router()
            .use(bodyParser() as any)
            .get('/login', context => {
                context.response.body = `
                <form action="/login" method="post">
                <input type="text" name="username">
                <input type="password" name="password">
                <input type="submit" value="Login">
                </form>
                `;
            })
            .post('/login', async context => {
                const {username, password} = context.request.body;
                let result = await this.login(username, password);
                context.response.body = 'Logged in';
                context.cookies.set(cookie, result.id_token);
                context.redirect('/');
            })
            .use(async (ctx, next) => {
                try {
                    await next();
                } catch (e) {
                    console.log(e.message);
                    throw e;
                }
            })
            .use(checkJwt);
    }
}
