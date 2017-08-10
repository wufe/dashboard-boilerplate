import { CLILoggingLevel } from "winston";

export type EnvironmentKindProduction = 'production';
export type EnvironmentKindDevelopment = 'development';

export type EnvironmentKind = EnvironmentKindProduction | EnvironmentKindDevelopment;

export type Environment = {
    kind: EnvironmentKind;
    rootPath: string;
    logging: {
        path: string;
        level: CLILoggingLevel;
    };
    persistence: {
        database: string;
    };
    server: {
        host: string;
        port: number;
    };
    authentication: {
        jwt: {
            secret: string;
            algorithm: string;
        };
        bcrypt: {
            rounds: number;
        };
    };
};

export const IOCTypes = {
    Environment: Symbol('Environment'),
    IHttpClient: Symbol('IHttpClient'),
    ILogger: Symbol('ILogger'),
    Mapper: Symbol('Mapper'),

    IWorker: Symbol('IWorker'),
    IStartupWorker: Symbol('IStartupWorker'),

    IConnectionBuilder: Symbol('IConnectionBuilder'),
    DatabaseContext: Symbol('DatabaseContext'),

    IUserRepository: Symbol('IUserRepository'),

    IMainController: Symbol('IMainController'),
    ICollectionController: Symbol('ICollectionController'),

    IAuthenticationService: Symbol('IAuthenticationService'),
    IWebServerService: Symbol('IWebServerService'),

    IAuthenticationMiddleware: Symbol('IAuthenticationMiddleware')
};

export const MappingTypes = {
    UserEntity: Symbol('UserEntity'),
    UserModel: Symbol('UserModel')
};