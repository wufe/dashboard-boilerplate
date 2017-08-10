import { IApplicationService } from "server/application/services/applicationService";
import { ICollectionController, CollectionController } from "server/application/controllers/api";
import { IOCTypes, Environment } from "server/infrastructure/types";
import { inject, injectable } from "inversify";
import { createExpressServer, useContainer, RoutingControllersOptions, useExpressServer } from "routing-controllers";
import { IOC } from "server/infrastructure/ioc/iocContainer";
import { ILogger, getDataDir, sanitizeFilename } from "server/utils";
import { RequestHandler, Request, Response, NextFunction } from "express";
import * as Express from 'express';
import { join, basename, resolve, dirname } from "path";
import { existsSync } from 'fs';
import { IAuthenticationMiddleware } from "server/application/middlewares";
import { json, urlencoded } from 'body-parser';
import { UserModel } from "domain/models";

export interface IWebServerService {
    start: () => void;
}

@injectable()
export class WebServerService implements IApplicationService, IWebServerService{

    @inject(IOCTypes.Environment) private _environment: Environment;
    @inject(IOCTypes.ILogger) private _logger: ILogger;

    @inject(IOCTypes.IAuthenticationMiddleware) private _authenticationMiddleware: IAuthenticationMiddleware;

    private RE_FRONTEND = /^\/((?!((build\/)|(dist\/))?static\/?)(?!api\/?)).*$/i;
    private RE_STATICS = /^\/((build\/)|(dist\/))?static\/?(.*?)$/i;

    start = () => {

        useContainer(IOC);
        const routingControllersOptions: RoutingControllersOptions = {
            routePrefix: '/api',
            controllers: [
                CollectionController
            ]
        };

        const expressApp = Express();
        
        expressApp.use(json());
        expressApp.use(urlencoded({
            extended: true
        }));

        const webServer = useExpressServer(expressApp, routingControllersOptions);

        webServer.use(this._authenticationMiddleware.initialize());

        webServer.all('/api/login', this._authenticationMiddleware.login());
        webServer.get('/api/auth', this._authenticationMiddleware.authenticate(), (req, res, next) => {
            this._logger.info(`[uID:${(req.user as UserModel).id}] Authentication succeeded.`, req.user);
            res.send('authenticated');
        });
        webServer.all(this.RE_FRONTEND, this._getFrontendHandler())
        webServer.all(this.RE_STATICS, this._getStaticsHandler());

        const { host, port } = this._environment.server;
        webServer.listen(port, host);

        this._logger.info(`[${host}:${port}] Web server started.`);
    };

    _getFrontendHandler(): RequestHandler {
        return (request: Request, response: Response, next: NextFunction) => {
            response.statusCode = 200;
            response.sendFile(join(resolve(dirname(basename((__filename))), 'index.html')));
        };
    }

    _getStaticsHandler(): RequestHandler {
        return (request: Request, response: Response, next: NextFunction) => {
            let assetMatch: any;
            if((assetMatch = request.url.match(this.RE_STATICS)) == null){
                response.sendStatus(400);
            }else{
                let assetName = sanitizeFilename(assetMatch[4]);
                let dataDir = getDataDir();

                // TODO: Vulnerability here?
                let assetPath = join(dataDir, 'static', assetName);
                if(existsSync(assetPath)){
                    response.sendFile(assetPath);
                }else{
                    response.send(`Cannot find ${assetPath}.`);
                }
            }
        };
    }

}