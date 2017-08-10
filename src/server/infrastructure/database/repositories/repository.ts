import { Repository as ORMRepository, FindOneOptions } from 'typeorm';
import { injectable } from "inversify";

export interface IRepository<T>{

    findOne: (options: FindOneOptions<T>) => Promise<T>;
    findOneById: (id: number, options?: FindOneOptions<T>) => Promise<T>;
}

@injectable()
export class Repository<T> implements IRepository<T>{

    constructor(
        private _repository: ORMRepository<T>
    ) {}

    findOne = async (options: FindOneOptions<T>) => {
        return await this._repository
            .findOne(options);
    }

    findOneById = async (id: number, options?: FindOneOptions<T>) => {
        return await this._repository
            .findOneById(id);
    }
}