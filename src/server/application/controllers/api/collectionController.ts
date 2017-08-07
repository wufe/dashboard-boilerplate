import { Controller, Get, JsonController } from 'routing-controllers';
import { IApiController } from "server/application/controllers/api/apiController";
import { IController } from "server/application/controllers/controller";
import { injectable } from "inversify";

export interface ICollectionController{}

@injectable()
@JsonController("/collections")
export class CollectionController implements IController, IApiController, ICollectionController {

    @Get()
    getAll = () => {
        return {
            'working': true
        };
    }

}