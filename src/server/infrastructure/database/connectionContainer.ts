import { Connection } from "typeorm";
import { injectable } from "inversify";

export interface IConnectionContainer {
    setConnection: (connection: Connection) => void;
    getConnection: () => Connection;
}

@injectable()
export class ConnectionContainer implements IConnectionContainer {

    private _connection: Connection;

    setConnection = (connection: Connection) => {
        this._connection = connection;
    };

    getConnection = () => this._connection;
}