import { Passport, Authenticator } from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as BearerStrategy } from 'passport-http-bearer';
import * as JWT from 'jsonwebtoken';
import { injectable, inject } from "inversify";
import { Environment, IOCTypes } from "server/infrastructure/types";
import { DatabaseContext } from "server/infrastructure/database/databaseContext";
import { Handler } from "express";
import { environment } from "server/infrastructure/environment";
import { ILogger } from "server/utils";
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { IUserRepository } from "server/infrastructure/database/repositories/userRepository";
import { User } from "server/infrastructure/database/entities";
import { IAuthenticationService } from "server/application/services/authenticationService";
import { UserModel } from "domain/models";

export interface IAuthenticationMiddleware{
    initialize: () => RequestHandler;
    authenticate: () => RequestHandler;
    login: () => RequestHandler;
}

type JWTTokenPayload = {
    issuer: number;
};

@injectable()
export class AuthenticationMiddleware implements IAuthenticationMiddleware{

    private UNAUTHORIZED_RESPONSE = {
        status: 'Error',
        code: 'Unauthorized'
    };

    private BEARER_STRATEGY_NAME = 'jwt-bearer';
    private LOCAL_STRATEGY_NAME = 'user-login';
    private _authenticator: Passport;

    constructor(
        @inject(IOCTypes.ILogger) private _logger: ILogger,
        @inject(IOCTypes.Environment) private _environment: Environment,
        @inject(IOCTypes.IAuthenticationService) private _authenticationService: IAuthenticationService
    ) {
        this._authenticator = new Authenticator() as Passport;
        this._authenticator.use(this.LOCAL_STRATEGY_NAME, this._getLoginStrategy());
        this._authenticator.use(this.BEARER_STRATEGY_NAME, this._getBearerStrategy());
        this._logger.verbose('Passport initialized.');
    }

    private _getLoginStrategy = () => {
        const options: any = { session: false };
        return new LocalStrategy({
            usernameField: 'email'
        }, async (email, password, callback) => {
            return callback(null, await this._authenticationService.findUserByCredentials(email, password));
        });
    }

    private _getBearerStrategy = () => {
        return new BearerStrategy((token, callback) => {
            this._logger.silly(`Received authentication token.`);
            const { secret, algorithm } = this._environment.authentication.jwt;
            JWT.verify(token, secret, {
                algorithms: [algorithm]
            }, async (error, decoded: JWTTokenPayload) => {
                if(error)
                    return callback(error);
                let user = decoded.issuer !== undefined ? await this._authenticationService.findUserById(decoded.issuer) : undefined;
                return callback(null, user ? user : false);
            })
        });
    };

    initialize = () => {
        return this._authenticator.initialize();
    }

    authenticate = () => {
        return (request: Request, response: Response, next: NextFunction) => {
            this._authenticator.authenticate(this.BEARER_STRATEGY_NAME, (error: any, user: UserModel, info: any) => {
                if(error){
                    this._logger.warn(`[failed][IP:${request.ip}] Authentication: jwt authentication failed.`);
                    return next(error);
                }
                if(user){
                    request.user = user;
                    this._logger.info(`[success][uID:${user.id}] Authentication: authorized jwt.`);
                    return next();
                }else{
                    this._logger.error(`[failed][IP:${request.ip}] Authentication: user not found.`);
                    return response.status(401).json(this.UNAUTHORIZED_RESPONSE);
                }
            })(request, response, next);
        };
    }

    login = () => {
        return (request: Request, response: Response, next: NextFunction) => {
            this._authenticator.authenticate(this.LOCAL_STRATEGY_NAME, (error: any, user: UserModel, info: any) => {
                if(error)
                    return next(error);
                if(!user){
                    this._logger.error(`[failed][IP:${request.ip}] Login: user not found.`);
                    return response.status(401).json(this.UNAUTHORIZED_RESPONSE);
                }else{
                    const { secret, algorithm } = this._environment.authentication.jwt;

                    const tokenPayload: JWTTokenPayload = {
                        issuer: user.id
                    };

                    this._logger.info(`[success][IP:${request.ip}] Login. Sending JWT.`);

                    return response.json({
                        token: JWT.sign(tokenPayload, secret, {
                            algorithm: algorithm
                        })
                    });
                }
            })(request, response, next);
        };
    }

}