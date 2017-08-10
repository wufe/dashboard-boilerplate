import * as Moment from 'moment-timezone';
import * as Mkdirp from 'mkdirp'
import { environment } from "server/infrastructure/environment";
import { resolve, dirname, basename, join } from "path";


export const getDateTimeFromUnixTimestamp: (timestamp: string) => Moment.Moment =
    (timestamp) => {
        return Moment(timestamp, 'X');
    };

export const ensureDirectoryExists: (path: string) => void =
    (path) => {
        Mkdirp.sync(path);
    };

export const getDataDir = () => {
    let rootPath = resolve(dirname(basename(__filename)));
    let dataDir = environment.kind == 'production' ? 'dist' : 'build';
    return join(rootPath, dataDir);
};

export const sanitizeFilename = (filename: string) => {
    return filename.replace(/\.\.\/?/i, '');
};

export * from 'server/utils/httpClient';
export * from 'server/utils/logger';
export * from 'server/utils/authenticationUtils';