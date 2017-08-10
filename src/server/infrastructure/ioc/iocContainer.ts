import { Container } from "inversify";
import { IMainController, MainController } from "server/application/controllers/mainController";
import { HttpClient, IHttpClient } from "server/utils/httpClient";
import { Logger, ILogger } from "server/utils/logger";
import { IOCTypes, Environment } from "server/infrastructure/types";
import { RandomWorker1, RandomWorker2, RandomWorker3 } from "server/application/workers/randomWorkers";
import { IStartupWorker, IWorker } from "server/application/workers";
import { IConnectionBuilder, ConnectionBuilder } from "server/infrastructure/database/connectionBuilder";
import { DatabaseContext } from "server/infrastructure/database/databaseContext";
import { CollectionController, ICollectionController } from "server/application/controllers/api";
import { WebServerService, IWebServerService } from "server/application/services";
import { environment } from "server/infrastructure/environment";
import { AuthenticationMiddleware, IAuthenticationMiddleware } from "server/application/middlewares";
import { IUserRepository, UserRepository } from "server/infrastructure/database/repositories/userRepository";
import { Mapper } from "server/infrastructure";
import { AuthenticationService, IAuthenticationService } from "server/application/services/authenticationService";

class IOCContainerBuilder {

    private _initialized: boolean = false;

    IOCContainer: Container & {
        bindController?: <T>(symbol: any, controller: {
            new (...args: any[]): T;
        }) => void;
    };

    init = () => {
        if(this._initialized)
            return;
        this._initialized = true;
        this.IOCContainer = new Container();

        this.IOCContainer.bindController = <T>(symbol: any, controller: {
                new (...args: any[]): T;
            }) => {
            this.IOCContainer.bind<T>(symbol).to(controller);
            this.IOCContainer.bind<T>(controller).to(controller);
        };

        // Controllers
        this.IOCContainer.bindController<IMainController>(IOCTypes.IMainController, MainController);

        // API Controllers
        this.IOCContainer.bindController<ICollectionController>(IOCTypes.ICollectionController, CollectionController);

        // SERVICES

        // Domain services

        // Application services
        this.IOCContainer.bind<IAuthenticationService>(IOCTypes.IAuthenticationService).to(AuthenticationService);
        this.IOCContainer.bind<IWebServerService>(IOCTypes.IWebServerService).to(WebServerService);

        // Application middlewares
        this.IOCContainer.bind<IAuthenticationMiddleware>(IOCTypes.IAuthenticationMiddleware).to(AuthenticationMiddleware);

        // Workers
        this.IOCContainer.bind<IWorker>(IOCTypes.IWorker).to(RandomWorker1);
        this.IOCContainer.bind<IWorker>(IOCTypes.IWorker).to(RandomWorker2);
        this.IOCContainer.bind<IWorker>(IOCTypes.IWorker).to(RandomWorker3);

        this.IOCContainer.bind<IStartupWorker>(IOCTypes.IStartupWorker).to(RandomWorker1);
        this.IOCContainer.bind<IStartupWorker>(IOCTypes.IStartupWorker).to(RandomWorker2);

        // INFRASTRUCTURE

        // Database
        this.IOCContainer.bind<IConnectionBuilder>(IOCTypes.IConnectionBuilder).to(ConnectionBuilder).inSingletonScope();
        this.IOCContainer.bind<DatabaseContext>(IOCTypes.DatabaseContext).toConstantValue(new DatabaseContext());

        // Repositories
        this.IOCContainer.bind<IUserRepository>(IOCTypes.IUserRepository).to(UserRepository);

        // Utilities
        this.IOCContainer.bind<Environment>(IOCTypes.Environment).toConstantValue(environment);
        this.IOCContainer.bind<IHttpClient>(IOCTypes.IHttpClient).to(HttpClient).inSingletonScope();
        this.IOCContainer.bind<ILogger>(IOCTypes.ILogger).to(Logger).inSingletonScope();
        this.IOCContainer.bind<Mapper>(IOCTypes.Mapper).to(Mapper).inSingletonScope();
    }
}

const IOCContainer = new IOCContainerBuilder();
IOCContainer.init();

export const IOC = IOCContainer.IOCContainer;