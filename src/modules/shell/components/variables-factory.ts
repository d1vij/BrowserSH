// TODO: implement this using custom hashmap ??

/**
 * Provides an abstracted way to store and retrieve variables
 * Instantiated only once in the GlobalsFactory and accessed from the shell singleton
 * Implementation is barebones and hence no exception is thrown (ideally) or handled by the instance itself, Everything has to be done by the callee itself.
 * 
 * Instance methods include
 * * get(name) -> Returns value as string for the variable, undefined if no variable is found with the passed name
 * * set(name, value) -> Sets the value for provided name, all variables are mutable and can be overwritten
 */
export class VariableSystemFactory {
    public variables: Map<string, string>;
    
    constructor(predefined?: Map<string, string>) {
        this.variables = predefined || new Map<string, string>();
    }
    
    public get(name: string): string | undefined {
        return this.variables.get(name);
    }

    public set(name: string, value: string) {
        this.variables.set(name, value.toString()); //just for safety
        return;
    }
}