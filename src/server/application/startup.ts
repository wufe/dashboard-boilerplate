import "reflect-metadata";

import { IOCTypes, MappingTypes } from "server/infrastructure/types";
import { environment } from 'server/infrastructure/environment';
import { IOC } from "server/infrastructure/ioc/iocContainer";
import { MainController, IMainController } from "server/application/controllers/mainController";
import { ILogger, cryptPassword } from "server/utils";
import { IStartupWorker } from "server/application/workers";
import { IConnectionBuilder } from "server/infrastructure/database/connectionBuilder";
import { Mapper } from "server/infrastructure";
import { User } from "server/infrastructure/database/entities";
import { UserModel } from "domain/models";

let logger: ILogger;

// Load IOC container & build
const loadIOC = () => {
    logger = IOC.get<ILogger>(IOCTypes.ILogger);
    logger.verbose('IOC container built.');
}

// Load environment
const loadEnvironment: () => void =
    () => {
        let env = environment;
        logger.verbose('Environment loaded.');
        return env;
    };

// Setup connections to the database
const connectDatabase: () => void =
    async () => {
        const connectionBuilder = IOC.get<IConnectionBuilder>(IOCTypes.IConnectionBuilder);
        await connectionBuilder.connect();
        logger.verbose('Connected to database.');
    };

// Setup mapping configurations
const setupMapper: () => void =
    async () => {
        const mapper = IOC.get<Mapper>(IOCTypes.Mapper);

        const userEntityToModelSignature = {
            source: MappingTypes.UserEntity,
            destination: MappingTypes.UserModel
        };
        mapper.createMap<User, UserModel>(userEntityToModelSignature, UserModel);

        const userModelToEntitySignature = {
            source: MappingTypes.UserModel,
            destination: MappingTypes.UserEntity
        };
        mapper.createMap<UserModel, User>(userModelToEntitySignature, User)
            .forMember('password', opt => opt.mapFrom(src => cryptPassword(src.password)))

        logger.verbose('Mapper initialized.');
    };

const start: () => void =
    async () => {
        // Start workers
        const workers = IOC.getAll<IStartupWorker>(IOCTypes.IStartupWorker);
        logger.verbose(`[${workers.length}] Workers started.`);

        // Start main controller run
        let mainController = IOC.get<IMainController>(IOCTypes.IMainController);
        mainController.run();
    };

export const Startup: () => void =
    async () => {
        try{
            loadIOC();
            loadEnvironment();
            await setupMapper();
            await connectDatabase();
            await start();
        }catch(e){
            console.error(e);
            logger.error(e);
        }
    };