import type { TParsedCommand } from "../../shell/typing/types";


/**
 * Notepad emulation
 */
export class Notepad{
    public static primary = "notepad";
    public static flags = [];
    public static options = [];
    public static subcommands = [];

    public static execute(parsed:TParsedCommand){
        parsed = parsed;
        throw new Error("not implemented");
        /**
         * notepad open <filename>
         * notepad create <filename>
         */
    }
    public static info(){
        return "TODO";
    }
    public static usage(){
        return "TODO";
    }
}