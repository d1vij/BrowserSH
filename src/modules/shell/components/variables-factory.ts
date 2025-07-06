export class VariableDoesNotExistsError extends Error {
  constructor(message: string) {
    super(`VariableDoesNotExistsError: ${ message }`);
    this.name = 'VariableDoesNotExistsError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class VariableSystemFactory {
    private variables: Record<string, string>
    constructor(predefined?:Record<string, string>){
        this.variables = predefined || {};
    }
    public get(name:string): string{
        const found = this.variables[name];
        if(!found) throw new VariableDoesNotExistsError(name);
        return found;
    }
    public set(name:string, value:string){
        // all variables are mutable ie no constants exist and can be modified anytime

        this.variables[name] = value.toString(); //just for safety
    }
}