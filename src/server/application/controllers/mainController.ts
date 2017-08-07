import { injectable, inject } from "inversify";
import { IOCTypes } from "server/framework/types";
import { ILogger } from "server/utils";
import { WebServerService, IWebServerService } from "server/application/services";

export interface IMainController {
    run: () => void;
}

@injectable()
export class MainController implements IMainController{

    @inject(IOCTypes.IWebServerService) private _webServerService: IWebServerService;

    run = () => {
        this._webServerService.start();  
    };

}