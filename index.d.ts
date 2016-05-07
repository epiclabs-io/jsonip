    export interface IJSONipOptions{
        serializer?: ()=>any;
        deserializer?:(input:any)=>any;
    }
    export interface ISerializable {
           serialize: ()=>any;
        deserialize:(input:any)=>void;
    
    }

    export function serialize(value:any,type:any);
    export function deserialize<R>(json:any,type:any):R;
    export function register(name:string, construct:any,options?:IJSONipOptions):void;
    export function unregister(name:string):void;