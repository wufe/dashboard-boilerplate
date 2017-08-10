import { createConnection, ConnectionOptions, Connection } from 'typeorm';
import { environment } from 'server/infrastructure/environment';
import { inject, injectable } from "inversify";

import * as Entities from 'server/infrastructure/database/entities';
import { IOCTypes, MappingTypes } from "server/infrastructure/types";
import { ILogger } from "server/utils";
import { DatabaseLogger } from "server/infrastructure/database/logger";
import { Collection, User } from "server/infrastructure/database/entities";
import { DatabaseContext } from "server/infrastructure/database/databaseContext";
import { UserModel } from "domain/models";
import { Mapper } from "server/infrastructure";

export interface IConnectionBuilder {
    connect: () => void;
}

@injectable()
export class ConnectionBuilder implements IConnectionBuilder{

    @inject(IOCTypes.ILogger) private _logger: ILogger;
    @inject(IOCTypes.DatabaseContext) private _databaseContext: DatabaseContext;
    @inject(IOCTypes.Mapper) private _mapper: Mapper;

    connect = async () => {

        this._logger.silly(`Connecting to ${environment.persistence.database}..`);

        const connectionOptions: ConnectionOptions = {
            type: 'sqlite',
            database: environment.persistence.database,

            name: 'default',
            logger: new DatabaseLogger(this._logger),
            synchronize: true,
            entities: [
                Collection,
                User
            ]
        };

        const connection = await createConnection(connectionOptions);
        await this._seed(connection);
        this._databaseContext.setConnection(connection);
    };

    private _seed = async (connection: Connection) => {
        const userRepository = connection.getRepository<User>(User);
        let foundAdmin = await userRepository.findOneById(1);
        if(!foundAdmin){
            let userModel = new UserModel({
                id: 1,
                email: 'admin@admin.com',
                password: 'admin',
                username: 'admin'
            });
            let userEntity = this._mapper.map<UserModel, User>({
                source: MappingTypes.UserModel,
                destination: MappingTypes.UserEntity
            }, userModel);
            await userRepository.save(userEntity);
        }
            
        this._logger.verbose('Seed completed.');
    }

}

