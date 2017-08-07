import {Environment} from "server/framework/types";
import { join, resolve, basename, dirname } from "path";

const logsPath = resolve(join(dirname(__filename), 'assets', 'logs'));
const database = resolve(join(dirname(__filename), 'assets', 'database', 'database.sqlite'));

export const production: Environment = {
    kind: 'production',
    logging: {
        path: logsPath,
        level: 'info'
    },
    persistence: {
        database
    },
    server: {
        host: '0.0.0.0',
        port: 8001
    }
};

export const development: Environment = {
    kind: 'development',
    logging: {
        path: logsPath,
        level: 'silly'
    },
    persistence: {
        database
    },
    server: {
        host: '0.0.0.0',
        port: 8001
    }
};