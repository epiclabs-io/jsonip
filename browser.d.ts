
declare var jsonj: jsonjns.IjsonjStatic;

declare module "jsonj" {
    export = jsonj;
}

declare namespace jsonjns {

    interface IjsonjOptions {
        serializer?: () => any;
        deserializer?: (input: any) => any;
    }

    interface ISerializable<T> {
        new (): T,
        serializeMetadata?: any;
    }

    class Map<T>{
        [key: string]: T;
    }
	
	interface IMapClass<T> {
    new (): Map<T>;
    [key: string]: T;
}

    interface IjsonjStatic {
        serialize<T>(value: T, type?: ISerializable<T>): Object;
        deserialize<R>(json: Object, type?: ISerializable<R>): R;
        register(name: string, construct: any, options?: IjsonjOptions): void;
        unregister(name: string): void;
        createMap<T>(type: { new (): T }): { new (): Map<T> }

    }

}