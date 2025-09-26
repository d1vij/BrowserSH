// Storage system to store arbitary data


type AllowedTypes = string 
                    | undefined
                    | number
                    | Array<number>
                    | Array<string>
                    | Array<Object>
                    | Array<AllowedTypes>;

type VariableMap = Map<string, AllowedTypes>

export class StorageSystem {
    protected storage: VariableMap;
    constructor(){
        this.storage = new Map<string, AllowedTypes>;
    }

    public get<T extends AllowedTypes>(key:string): AllowedTypes{
        return this.storage.get(key) as T;
    }
    public set(key:string, value:AllowedTypes){
        this.storage.set(key, value);
    }
}