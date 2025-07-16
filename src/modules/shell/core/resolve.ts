
import { TerminalOutputHandler } from "../../output-handler/terminal-output-handler";

/**
 * Handles the output work for the shell
 */
export class Resolve{
    // resolving error messages
    public static error(){
        
    }
}

export function resolve(content:string){
    TerminalOutputHandler.printToTerminalOld(content);
}