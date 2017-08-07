
import { injectable, inject } from "inversify";
import { ConnectionContainer } from "server/infrastructure/database/connectionContainer";
import { IOCTypes } from "server/framework/types";
import * as Entities from 'server/infrastructure/database/entities';

@injectable()
export class DatabaseContext{

    @inject(IOCTypes.IConnectionContainer) private _connectionContainer: ConnectionContainer;

    get = () => this._connectionContainer.getConnection().manager;

    getConnection = () => this._connectionContainer.getConnection();

    getEntityManager = () => this._connectionContainer.getConnection().entityManager;

    getRepository = (entity: Function) => this._connectionContainer.getConnection().getRepository(entity);

}