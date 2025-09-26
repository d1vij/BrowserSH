// TODO:Fix documentation
// TODO: implement this using custom hashmap ??

import { StorageSystem } from "./storage-system";

/**
 * Provides an abstracted way to store and retrieve string variables
 * Instantiated only once in the GlobalsFactory and accessed from the shell singleton
 * Implementation is barebones and hence no exception is thrown (ideally) or handled by the instance itself, Everything has to be done by the callee itself.
 * 
 * Instance methods include
 * * get(name) -> Returns value as string for the variable, undefined if no variable is found with the passed name
 * * set(name, value) -> Sets the value for provided name, all variables are mutable and can be overwritten
 */

export class VariableSystem extends StorageSystem {
    constructor(predefined = new Map<string, string>()){
        super();
        for(const [key, value] of predefined.entries()){
            this.set(key, value);
        }
    }

    public override get(name: string): string | undefined {
        return this.storage.get(name) as string;
    }

    public override set(name: string, value: string) {
        this.storage.set(name, value.toString()); //just for safety
        return;
    }
}