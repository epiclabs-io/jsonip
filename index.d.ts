declare module "jsonip" {
    
    export interface IJSONipOptions{
        serializer?: ()=>any;
        deserializer?:(input:any)=>any;
    }
    export interface ISerializable {
           serialize: ()=>any;
        deserialize:(input:any)=>void;
    
    }
    export function stringify(value:any, replacer:(key:string,value:any)=>any);
    export function parse(text:string,reviver:(key:string,value:any)=>any);
    export function register(name:string, construct:Function,options:IJSONipOptions);
    export function unregister(name:string);
    
    
}