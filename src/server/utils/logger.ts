import * as Winston from 'winston';
import { environment } from "server/infrastructure/environment";
import { ensureDirectoryExists } from "server/utils";
import { join } from "path";
import * as Moment from 'moment';
import { injectable } from "inversify";

export interface ILogger{
    log: (log: string, level: Winston.CLILoggingLevel, ...meta: any[]) => void;
    error: (log: string, ...meta: any[]) => void;
    warn: (log: string, ...meta: any[]) => void;
    help: (log: string, ...meta: any[]) => void;
    data: (log: string, ...meta: any[]) => void;
    info: (log: string, ...meta: any[]) => void;
    debug: (log: string, ...meta: any[]) => void;
    prompt: (log: string, ...meta: any[]) => void;
    verbose: (log: string, ...meta: any[]) => void;
    input: (log: string, ...meta: any[]) => void;
    silly: (log: string, ...meta: any[]) => void;
}

@injectable()
export class Logger implements ILogger{

    private _logger: Winston.LoggerInstance;

    private initializeFolders: () => void =
        () => {
            ensureDirectoryExists(environment.logging.path);
        };

    private makeLogger: () => void =
        () => {
            this.initializeFolders();
            this._logger = new Winston.Logger({
                transports: [
                    new Winston.transports.Console(),
                    new Winston.transports.File({
                        filename: join(environment.logging.path, `${Moment().format('DDMMYYYY')}.log`)
                    })
                ],
                level: environment.logging.level,
                levels: Winston.config.cli.levels,
                colors: Winston.config.cli.colors
            });
            this._logger.cli();
        };

    constructor() {
        this.makeLogger();
        this.verbose(`Created log directory in ${environment.logging.path}.`);
    }

    log: (log: string, level: Winston.CLILoggingLevel, ...meta: any[]) => void =
        (log, level = 'debug', ...meta) => {
            this._logger.log(level, log, meta);
        };

    error: (log: string, ...meta: any[]) => void =
        (log, ...meta) => {
            this._logger.error(log, meta);
        };

    warn: (log: string, ...meta: any[]) => void =
        (log, ...meta) => {
            this._logger.warn(log, meta);
        };

    help: (log: string, ...meta: any[]) => void =
        (log, ...meta) => {
            this._logger.help(log, meta);
        };

    data: (log: string, ...meta: any[]) => void =
        (log, ...meta) => {
            this._logger.data(log, meta);
        };

    info: (log: string, ...meta: any[]) => void =
        (log, ...meta) => {
            this._logger.info(log, meta);
        };

    debug: (log: string, ...meta: any[]) => void =
        (log, ...meta) => {
            this._logger.debug(log, meta);
        };

    prompt: (log: string, ...meta: any[]) => void =
        (log, ...meta) => {
            this._logger.prompt(log, meta);
        };

    verbose: (log: string, ...meta: any[]) => void =
        (log, ...meta) => {
            this._logger.verbose(log, meta);
        };

    input: (log: string, ...meta: any[]) => void =
        (log, ...meta) => {
            this._logger.input(log, meta);
        };

    silly: (log: string, ...meta: any[]) => void =
        (log, ...meta) => {
            this._logger.silly(log, meta);
        };

}