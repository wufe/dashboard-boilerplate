import { Logger, QueryRunner } from "typeorm";
import { ILogger } from "server/utils";

export class DatabaseLogger implements Logger{

    constructor(private _logger: ILogger) {}
    
    logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
        this._logger.data(query, { parameters });
    }

    logQueryError(error: string, query: string, parameters?: any[], queryRunner?: QueryRunner) {
        this._logger.error(error, { query, parameters });
    }

    logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner) {
        this._logger.warn(`[${time}] ${query}`, { parameters });
    }

    logSchemaBuild(message: string, queryRunner?: QueryRunner) {
        this._logger.debug(message, {});
    }

    log(level: "log" | "info" | "warn", message: any, queryRunner?: QueryRunner) {
        let logLevel: 'verbose' | 'info' | 'warn' | 'debug';
        switch(level){
            case 'log':
                logLevel = 'verbose';
                break;
            case 'info':
                logLevel = 'info';
                break;
            case 'warn':
                logLevel = 'warn';
            default:
                logLevel = 'debug';
        }
        this._logger.log(message, logLevel, {});
    }

}