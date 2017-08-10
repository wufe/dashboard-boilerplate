import { injectable, inject } from "inversify";
import { DatabaseContext } from 'server/infrastructure/database/databaseContext';
import { IOCTypes } from "server/infrastructure/types";
import { IRepository, Repository } from "server/infrastructure/database/repositories";
import { User } from "server/infrastructure/database/entities";

export interface IUserRepository extends IRepository<User>{ }

@injectable()
export class UserRepository extends Repository<User> implements IUserRepository{

    private _databaseContext: DatabaseContext;

    constructor(
        @inject(IOCTypes.DatabaseContext) databaseContext: DatabaseContext
    ) {
        super(databaseContext.getRepository(User));
        this._databaseContext = databaseContext;
    }

}