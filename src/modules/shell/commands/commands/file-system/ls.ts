import { __shell } from "../../../../../main";
import { addColor, OutputTemplates } from "../../../../output-handler/formatter";
import { TerminalOutputHandler } from "../../../../output-handler/terminal-output-handler";
import { Colors } from "../../../../output-handler/typing/enums";
import { FileSystem } from "../../../components/file-system/file-system";
import type { Tokens } from "../../../core/__typing";
import { getCommandContext } from "../../../core/extract";
import { IncorrectArgumentsCountError, InvalidNumberError } from "../../__errors";
import { AbstractCommand } from "../../AbstractCommand";
import { getPathContext } from "../../../components/file-system/getPathContext";

export class Ls extends AbstractCommand{
    public name: string = "ls";
    public flags: string[] = [];
    public options: string[] = ['d', "depth"];

    protected __execute(tokens:Tokens){
        const results = getCommandContext(tokens);
        if(results.remainingTokens.length >= 2) throw new IncorrectArgumentsCountError("0 or 1", results.remainingTokens.length);

        const path = results.remainingTokens[0] || "."
        const context = getPathContext(path, __shell.globals.fs.currentDirectoryNode);
        
        let depth:number | string = results.options["depth"] || results.options['d'] || "1";

        if(depth === "inf"){
            depth = Infinity;
        } else {
            depth = parseInt(depth);
            if(!Number.isInteger(depth)) throw new InvalidNumberError(depth.toString());
        }
        
        const dirTree = FileSystem.traverseAndList(context, depth);
        TerminalOutputHandler.printToTerminalOld(OutputTemplates.standardTerminalOutput(dirTree));
    }
    
    
    public handleErrors(err: any): void {
        if(err instanceof InvalidNumberError){

            TerminalOutputHandler.standardErrorOutput([
                `InvalidNumberError: Error in parsing ${addColor(err.num, Colors.yellow_light)}. Enter a valid number`
            ]);
        }
        else if (err instanceof IncorrectArgumentsCountError){
            TerminalOutputHandler.standardErrorOutput([
                `IncorrectArgumentsCountError: This command only takes one argument!`,
                `Pass any paths with spaces inside quotations!`
            ])
        }
    }
    public info(): string[] {
        return [
            "list contents of the current directory"
        ];
    }

    public usage(): string[] {
        return [
            "usage: ls",
            "",
            "Arguments:",
            "\t(none) -> This command does not take any arguments currently.",
            "",
            "Description:",
            "\tLists all files and folders in the current working directory.",
            "\tOnly the current directory is supported — no paths or flags allowed.",
            "",
            "Examples:",
            `\t${addColor("ls", Colors.blue_light)} => Displays all contents of the current directory`
        ];
    }

}