
declare var jsonip: jsonipns.IJsoniPStatic;

declare module "jsonip" {
    export = jsonip;
}

declare interface ISerializable<T> {
    new (): T,
    serializeMetadata?: any;
}

declare class Map<T>{
    [key: string]: T;
}

declare namespace jsonipns {

    interface IJSONipOptions {
        serializer?: () => any;
        deserializer?: (input: any) => any;
    }




    interface IJsoniPStatic {
        serialize<T>(value: T, type: ISerializable<T>): Object;
        deserialize<R>(json: Object, type: ISerializable<R>): R;
        register(name: string, construct: any, options?: IJSONipOptions): void;
        unregister(name: string): void;
        createMap<T>(type: { new (): T }): { new (): Map<T> }

    }

}