export class CommandDoesNotExistsError extends Error {
  constructor(message: string) {
    super(`CommandDoesNotExistsError: ${ message }`);
    this.name = 'CommandDoesNotExistsError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
export type TStaticClass = (new (...args: any[]) => any);
export class Commands{
    private static commands: Record<string, TStaticClass | undefined> = {

    }
    public static get(name:string): TStaticClass{
        const found = this.commands[name];
        if(!found) throw new CommandDoesNotExistsError(name);
        return found;
    }
}