import "reflect-metadata";

import { IOCTypes } from "server/framework/types";
import {environment} from 'server/framework/environment';
import { IOC } from "server/framework/ioc/iocContainer";
import { MainController, IMainController } from "server/application/controllers/mainController";
import { ILogger } from "server/utils";
import { IStartupWorker } from "server/application/workers";
import { IConnectionBuilder } from "server/infrastructure/database/connectionBuilder";

const logger = IOC.get<ILogger>(IOCTypes.ILogger);

const loadEnvironment: () => void =
    () => {
        return environment;
    };

const connectDatabase: () => void =
    async () => {
        const connectionBuilder = IOC.get<IConnectionBuilder>(IOCTypes.IConnectionBuilder);
        await connectionBuilder.connect();
        logger.verbose('Connected to database.');
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
        loadEnvironment();
        logger.silly('Environment loaded.');
        try{
            await connectDatabase();
            await start();
        }catch(e){
            logger.error(e);
        }
    };