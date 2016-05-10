export interface IjsonjOptions {
    serializer?: () => any;
    deserializer?: (input: any) => any;
}

export interface ISerializable<T> {
    new (): T,
    serializeMetadata?: any;
}

export function serialize<T>(value: T, type?: ISerializable<T>): Object;
export function deserialize<R>(json: Object, type?: ISerializable<R>): R;
export function register<T>(name: string, construct: ISerializable<T>, options?: IjsonjOptions): void;
export function unregister(name: string): void;


export declare class Map<T>{
    [key: string]: T;
}

interface IMapClass<T> {
    new (): Map<T>;
    [key: string]: T;
}

export function createMap<T>(type: { new (): T }): IMapClass<T>
