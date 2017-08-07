import { IWorker, IStartupWorker } from "server/application/workers";
import { injectable } from "inversify";

@injectable()
export class RandomWorker1 implements IWorker, IStartupWorker {

    constructor() {
        setInterval(this.run, 3000);
    }

    run = () => {
        //console.log('1')
    }
}

@injectable()
export class RandomWorker2 implements IWorker, IStartupWorker {

    constructor() {
        setInterval(this.run, 3000);
    }

    run = () => {
        //console.log('2')
    }
}

@injectable()
export class RandomWorker3 implements IWorker {

    constructor() {
        setInterval(this.run, 1000);
    }

    run = () => {
        //console.log('3')
    }
}