import { Connection, ObjectType } from "typeorm";
import { injectable, inject } from "inversify";
import { IOCTypes } from "server/infrastructure/types";
import * as Entities from 'server/infrastructure/database/entities';

@injectable()
export class DatabaseContext{

    private _connection: Connection;

    setConnection = (connection: Connection) => this._connection = connection;
    
    getConnection = () => this._connection;

    get = () => this._connection.manager;

    getEntityManager = () => this._connection.entityManager;

    getRepository = <T>(entity: ObjectType<T>) => this._connection.getRepository<T>(entity);

}