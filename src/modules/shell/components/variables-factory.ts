// TODO: implement this using custom hashmap ??
export class VariableDoesNotExistsError extends Error {
    public varName: string;
    constructor(message: string, varName:string) {
        super(`VariableDoesNotExistsError: ${message}`);
        this.name = 'VariableDoesNotExistsError';
        this.varName = varName;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class VariableSystemFactory {
    private variables: Map<string, string>;
    constructor(predefined?: Map<string, string>) {
        this.variables = predefined || new Map<string, string>();
        this.set("ping", "pong");
    }
    public get(name: string): string | undefined {
        return this.variables.get(name);
    }
    public set(name: string, value: string) {
        // all variables are mutable ie no constants exist and can be modified anytime
        this.variables.set(name, value.toString()); //just for safety
    }
}