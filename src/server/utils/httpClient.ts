import * as Superagent from 'superagent';
import { injectable } from "inversify";

export interface IHttpClient{
    get: (url: string) => Superagent.SuperAgentRequest;
}

@injectable()
export class HttpClient implements IHttpClient{

    public get: (url: string) => Superagent.SuperAgentRequest =
        (url) => {
            return Superagent.get(url);
        };

}