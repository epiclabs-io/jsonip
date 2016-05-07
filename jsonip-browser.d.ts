
declare var jsonip: jsonip.IJsoniPStatic;

declare module "jsonip" {
    export = jsonip;
}

declare namespace jsonip {

    interface IJSONipOptions {
        serializer?: () => any;
        deserializer?: (input: any) => any;
    }
    interface ISerializable {
        serialize: () => any;
        deserialize: (input: any) => void;

    }

    interface IJsoniPStatic {
        serialize(value: any, type: any);
        deserialize<R>(json: any, type: any):R;
        register(name: string, construct: any, options?: IJSONipOptions): void;
        unregister(name: string): void;
    }

}