import { __shell } from "../../../../../main";
import { addColor } from "../../../../output-handler/formatter";
import { TerminalOutputHandler } from "../../../../output-handler/terminal-output-handler";
import { Colors } from "../../../../output-handler/typing/enums";
import { NodeToRemoveIsADirectoryAndNoRecurseFlagIsProvidedError } from "../../../components/__errors";
import { FileSystem } from "../../../components/file-system/file-system";
import type { Tokens } from "../../../core/__typing";
import { getCommandContext } from "../../../core/extract";
import { NodeNotFoundError } from "../../__errors";
import { AbstractCommand } from "../../AbstractCommand";

export class Rm extends AbstractCommand{
    public name: string = "rm";
    public flags: string[] = ['r'];
    public options: string[] = [];
    public execute(tokens: Tokens): void {
        try{
            
            const results = getCommandContext(tokens);
            const recurse = results.flags.includes('r');
            
            FileSystem.deleteNodeByPath(results.remainingTokens[0], __shell.globals.fs.currentDirectoryNode, recurse);
        }catch(err){
            if(err instanceof NodeToRemoveIsADirectoryAndNoRecurseFlagIsProvidedError){
                TerminalOutputHandler.standardErrorOutput([
                    `Target node is a directory and no recurse flag was used, skipping delete`,
                    `Use ${addColor("-r", Colors.blue_light)} flag to remove directories.`
                ])
            } else if(err instanceof NodeNotFoundError){
                TerminalOutputHandler.standardErrorOutput([
                    `No node found at path ${err.path}`
                ])
            }
        }
    }
    public handleErrors(err: any): void {
        
    }
    public info(): Array<string> {
        
    }
    public usage(): Array<string> {
        
    }
}