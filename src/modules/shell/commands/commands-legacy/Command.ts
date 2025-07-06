import type { TParsedCommand } from "../shell/typing/types.js";
import type {TOption, TFlag, TCommand } from "../shell/typing/types.js";


/**
 * Interface which any primary command abides by
 */
export interface ICommand {

    /**
     * Name of primary command
     */
    primary: TCommand;
    
    /**
     * all the valid flags primary command can have
     */
    flags: TFlag[];

    /**
     * all the valid options primary command can have
     */
    options: TOption[];

    /**
     * all the sub commands that a primary command may have
     * FIXME: Probably look into this sometime
     */
    subcommands: string[];

    /**
     * main command executor
     */
    execute(parsed: TParsedCommand): void;

    /**
     * returns info about the primary command
     */
    info(): string;

    /**
     * returns usage of the primary command
     */
    usage(): string;
}