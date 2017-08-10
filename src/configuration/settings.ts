import {Environment} from "server/infrastructure/types";
import { join, resolve, basename, dirname } from "path";

declare let global: NodeJS.Global & {
    TRANSPILED?: true;
};

export const getRootPath = () => {
    return global.TRANSPILED ?
        resolve(dirname(dirname(__filename))) :
        resolve(dirname(dirname(dirname(__filename))));
};

export const getCodePath = (rootPath: string, isProduction: boolean = false) => {
    return join(rootPath, isProduction ? 'dist' : 'build');
};

export const getLogsPath = (codePath: string) => {
    return join(codePath, 'assets', 'logs');
};

export const getDatabasePath = (codePath: string) => {
    return join(codePath, 'assets', 'database', 'database.sqlite');
};

const rootPath = getRootPath();

export const getProductionEnvironment: () => Environment = 
    () => {
        return {
            kind: 'production',
            rootPath,
            logging: {
                path: getLogsPath(getCodePath(rootPath, true)),
                level: 'info'
            },
            persistence: {
                database: getDatabasePath(getCodePath(rootPath, true))
            },
            server: {
                host: '0.0.0.0',
                port: 8001
            },
            authentication: {
                jwt: {
                    secret: 'secret',
                    algorithm: 'HS256'
                },
                bcrypt: {
                    rounds: 13
                }
            }
        };
    };

export const getDevelopmentEnvironment: () => Environment = 
    () => {
        return {
            kind: 'development',
            rootPath,
            logging: {
                path: getLogsPath(getCodePath(rootPath, false)),
                level: 'silly'
            },
            persistence: {
                database: getDatabasePath(getCodePath(rootPath, false))
            },
            server: {
                host: '0.0.0.0',
                port: 8001
            },
            authentication: {
                jwt: {
                    secret: 'secret',
                    algorithm: 'HS256'
                },
                bcrypt: {
                    rounds: 13
                }
            }
        };
    };