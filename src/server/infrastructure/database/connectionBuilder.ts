import { createConnection, ConnectionOptions } from 'typeorm';
import { environment } from 'server/framework/environment';
import { inject, injectable } from "inversify";

import * as Entities from 'server/infrastructure/database/entities';
import { IOCTypes } from "server/framework/types";
import { ILogger } from "server/utils";
import { DatabaseLogger } from "server/infrastructure/database/logger";
import { Collection } from "server/infrastructure/database/entities";
import { IConnectionContainer } from "server/infrastructure/database/connectionContainer";

export interface IConnectionBuilder {
    connect: () => void;
}

@injectable()
export class ConnectionBuilder implements IConnectionBuilder{

    @inject(IOCTypes.ILogger) private _logger: ILogger;
    @inject(IOCTypes.IConnectionContainer) private _connectionContainer: IConnectionContainer;

    connect = async () => {
        const connectionOptions: ConnectionOptions = {
            type: 'sqlite',
            database: environment.persistence.database,

            name: 'default',
            logger: new DatabaseLogger(this._logger),
            synchronize: true,
            entities: [
                Collection
            ]
        };

        const connection = await createConnection(connectionOptions);
        this._connectionContainer.setConnection(connection);
    };

}

