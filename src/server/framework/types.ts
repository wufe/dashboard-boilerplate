import { CLILoggingLevel } from "winston";

export type EnvironmentKindProduction = 'production';
export type EnvironmentKindDevelopment = 'development';

export type EnvironmentKind = EnvironmentKindProduction | EnvironmentKindDevelopment;

export type Environment = {
    kind: EnvironmentKind;
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
};

export const IOCTypes = {
    Environment: Symbol('Environment'),
    IHttpClient: Symbol('IHttpClient'),
    ILogger: Symbol('ILogger'),

    IWorker: Symbol('IWorker'),
    IStartupWorker: Symbol('IStartupWorker'),

    IConnectionBuilder: Symbol('IConnectionBuilder'),
    IConnectionContainer: Symbol('IConnectionContainer'),

    DatabaseContext: Symbol('DatabaseContext'),

    IMainController: Symbol('IMainController'),
    ICollectionController: Symbol('ICollectionController'),

    IWebServerService: Symbol('IWebServerService')
};