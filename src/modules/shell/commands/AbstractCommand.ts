import type { TCommand, TFlag, Tokens, TOption } from "../core/__typing";
export abstract class AbstractCommand {
    /**
     * Name of primary command
    */
    public abstract name: TCommand;

    /**
     * all the valid flags primary command can have
    */
    public abstract flags: Array<TFlag>;

    /**
     * all the valid options primary command can have
    */
    public abstract options: Array<TOption>;

    /**
     * main command executor
    */
    public abstract execute(tokens:Tokens): void;

    /**
     * Command specific error handling
     */
    public abstract handleErrors(err:any): void;
    
    /**
     * returns info about the primary command
     */
    public abstract info(): Array<string>;

    /**
     * returns info about the primary command
     */
    public abstract usage(): Array<string>;
}