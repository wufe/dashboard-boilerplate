import { Container } from "inversify";
import { IMainController, MainController } from "server/application/controllers/mainController";
import { HttpClient, IHttpClient } from "server/utils/httpClient";
import { Logger, ILogger } from "server/utils/logger";
import { IOCTypes, Environment } from "server/framework/types";
import { RandomWorker1, RandomWorker2, RandomWorker3 } from "server/application/workers/randomWorkers";
import { IStartupWorker, IWorker } from "server/application/workers";
import { IConnectionContainer, ConnectionContainer } from "server/infrastructure/database/connectionContainer";
import { IConnectionBuilder, ConnectionBuilder } from "server/infrastructure/database/connectionBuilder";
import { DatabaseContext } from "server/infrastructure/database/databaseContext";
import { CollectionController, ICollectionController } from "server/application/controllers/api";
import { WebServerService, IWebServerService } from "server/application/services";
import { environment } from "server/framework/environment";

const IOC: Container & {
    bindController?: <T>(symbol: any, controller: {
        new (...args: any[]): T;
    }) => void;
} = new Container();

IOC.bindController = <T>(symbol: any, controller: {
        new (...args: any[]): T;
    }) => {
    IOC.bind<T>(symbol).to(controller);
    IOC.bind<T>(controller).to(controller);
};

// Controllers
IOC.bindController<IMainController>(IOCTypes.IMainController, MainController);

// API Controllers
IOC.bindController<ICollectionController>(IOCTypes.ICollectionController, CollectionController);

// SERVICES

// Domain services

// Application services
IOC.bind<IWebServerService>(IOCTypes.IWebServerService).to(WebServerService);

// Workers
IOC.bind<IWorker>(IOCTypes.IWorker).to(RandomWorker1);
IOC.bind<IWorker>(IOCTypes.IWorker).to(RandomWorker2);
IOC.bind<IWorker>(IOCTypes.IWorker).to(RandomWorker3);

IOC.bind<IStartupWorker>(IOCTypes.IStartupWorker).to(RandomWorker1);
IOC.bind<IStartupWorker>(IOCTypes.IStartupWorker).to(RandomWorker2);

// INFRASTRUCTURE

// Database
IOC.bind<IConnectionBuilder>(IOCTypes.IConnectionBuilder).to(ConnectionBuilder).inSingletonScope();
IOC.bind<IConnectionContainer>(IOCTypes.IConnectionContainer).to(ConnectionContainer).inSingletonScope();
IOC.bind<DatabaseContext>(IOCTypes.DatabaseContext).toConstantValue(new DatabaseContext());

// Utilities
IOC.bind<Environment>(IOCTypes.Environment).toConstantValue(environment);
IOC.bind<IHttpClient>(IOCTypes.IHttpClient).to(HttpClient).inSingletonScope();
IOC.bind<ILogger>(IOCTypes.ILogger).to(Logger).inSingletonScope();

const logger = IOC.get<ILogger>(IOCTypes.ILogger);
logger.silly('IOC Container built.');

export {IOC};