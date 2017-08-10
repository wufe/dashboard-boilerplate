import { injectable } from "inversify";

type ElementsType<T, K extends keyof T> = T[K];

type ElementSelector<T> = (object: T) => ElementsType<T, keyof T>;
type StringElementSelector<T> = keyof T;

interface IOperationConfiguration<T> {
    mapFrom: ( selector: ElementSelector<T> ) => ElementsType<T, keyof T>;
    ignore: () => ElementsType<T, keyof T>;
}

type ElementOperation<T> = ( opt: IOperationConfiguration<T> ) => ElementsType<T, keyof T>;

type Operation<D, S> = {
    selector: StringElementSelector<D>;
    operation?: ElementOperation<S>;
};

export class OperationConfiguration<T> implements IOperationConfiguration<T>{
    ignore = () => undefined as ElementsType<T, keyof T>;

    constructor(
        private _entity: T
    ) {}

    mapFrom: (selector: ElementSelector<T>) => ElementsType<T, keyof T> =
        (selector) => {
            return selector(this._entity);
        };
}

export interface IGenericMap {}

export interface IMap<S, D> extends IGenericMap{
    forMember: ( selector: StringElementSelector<D>, operation: ElementOperation<S> ) => this;
    //forSourceMember: ( selector: StringElementSelector<S>, operation: ElementOperation<D> ) => this;
    map: (sourceEntity: S, destinationEntity?: D) => D;
}

export class Map<S, D> implements IMap<S, D>{

    private _destOperations: Operation<D, S>[] = [];
    private _sourceOperations: Operation<S, D>[] = [];
    
    constructor(
        private DestinationClass: { new(): D }
    ) {}

    forMember: (selector: StringElementSelector<D>, operation: ElementOperation<S>) => this =
        (selector, operation) => {
            this._destOperations.push({
                selector,
                operation
            });
            return this;
        };

    forSourceMember: (selector: StringElementSelector<S>, operation: ElementOperation<D>) => this =
        (selector, operation) => {
            this._sourceOperations.push({
                selector,
                operation
            });
            return this;
        };

    // TODO: Implement inverse mapping using _sourceOperations
    map: (sourceEntity: S, destinationEntity?: D) => D = 
        (source, destination) => {
            if(!source)
                return;
            let destinationObject: D = destination !== undefined ? destination : new this.DestinationClass();
            let mappedProperties: string[] = [];
            for(let destOperation of this._destOperations){
                let operationConfiguration = new OperationConfiguration<S>(source);
                let newValue = destOperation.operation(operationConfiguration) as any;
                if(newValue !== undefined)
                    destinationObject[destOperation.selector] = newValue;
                mappedProperties.push(destOperation.selector);
            }
            for(let key in source){
                if(source[key] !== undefined && mappedProperties.indexOf(key) == -1){
                    (destinationObject as D & {
                        [index: string]: any;
                    })[key] = source[key];
                }
            }
            return destinationObject;
        };
};

export type MapSignature = {
    source: symbol;
    destination: symbol;
};

export type Mapping = MapSignature & {
    map: IGenericMap;
}

@injectable()
export class Mapper {
    private _mappings: Mapping[] = [];

    createMap = <S, D>({
        source,
        destination
    }: MapSignature, destinationEntity: { new(): D }): IMap<S, D> => {
        const map = new Map<S, D>(destinationEntity);
        this._mappings.push({
            source,
            destination,
            map
        });
        return map;
    };

    map = <S, D>({ source, destination }: MapSignature, sourceEntity: S, destinationEntity?: D): D => {
        let mapping: Mapping = this._mappings
            .filter(m => m.source === source && m.destination === destination)[0];
        if(mapping){
            let map: Map<S, D> = mapping.map as Map<S, D>;
            return map.map(sourceEntity, destinationEntity);
        }
        return;
    }
}