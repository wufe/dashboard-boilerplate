import { injectable, inject } from "inversify";
import { UserModel } from "domain/models";
import { Mapper, MapSignature } from "server/infrastructure";
import { IOCTypes, MappingTypes } from "server/infrastructure/types";
import { IUserRepository } from "server/infrastructure/database/repositories/userRepository";
import { User } from "server/infrastructure/database/entities";
import { verifyPassword } from "server/utils";

export interface IAuthenticationService {
    findUserByCredentials: (identity: string, password: string) => Promise<UserModel>;
    findUserById:(id: number) => Promise<UserModel>;
}

@injectable()
export class AuthenticationService implements IAuthenticationService{

    @inject(IOCTypes.Mapper) private _mapper: Mapper;
    @inject(IOCTypes.IUserRepository) private _userRepository: IUserRepository;

    private _userToModelSignature: MapSignature = {
        source: MappingTypes.UserEntity,
        destination: MappingTypes.UserModel
    };

    findUserByCredentials = async (identity: string, password: string) => {
        let user = this._mapper.map<User, UserModel>(
            this._userToModelSignature,
            await this._userRepository.findOne({
                where: {
                    email: identity
                }
            })
        );
        if(user && verifyPassword(password, user.password))
            return user;
        return;
    };

    findUserById = async (id: number) => {
        return this._mapper.map<User, UserModel>(
            this._userToModelSignature,
            await this._userRepository.findOneById(id)
        )
    }
}