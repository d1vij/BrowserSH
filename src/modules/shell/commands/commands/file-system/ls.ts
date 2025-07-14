import { __shell } from "../../../../../main";
import { addColor, OutputTemplates } from "../../../../output-handler/formatter";
import { TerminalOutputHandler } from "../../../../output-handler/terminal-output-handler";
import { Colors } from "../../../../output-handler/typing/enums";
import { FileSystem } from "../../../components/file-system/file-system";
import type { Tokens } from "../../../core/__typing";
import { extractFlagsAndOptions } from "../../../core/extract";
import { IncorrectArgumentsCountError } from "../../__errors";
import { AbstractCommand } from "../../AbstractCommand";

export class Ls extends AbstractCommand{
    public name: string = "ls";
    public flags: string[] = [];
    public options: string[] = [];
    public execute(tokens: Tokens): void {
        try{
            this.__execute(tokens);
        } catch(err){
            this.handleErrors(err);
        }
    }
    private __execute(tokens:Tokens){
        const results = extractFlagsAndOptions(tokens);
        if(results.remainingTokens.length != 0) throw new IncorrectArgumentsCountError(0, results.remainingTokens.length);
        // TODO:complete

        const dirTree = FileSystem.traverseAndList(__shell.globals.fs.currentDirectoryNode);
        TerminalOutputHandler.printToTerminal(OutputTemplates.standardTerminalOutput(dirTree));
    }
    
    
    public handleErrors(err: any): void {
        TerminalOutputHandler.standardErrorOutput([
            `UNEXPECTED_ERROR: ${err.name}`,
            err.toString()
        ])
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