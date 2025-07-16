import { __shell } from "../../../../../main";
import { addColor } from "../../../../output-handler/formatter";
import { TerminalOutputHandler } from "../../../../output-handler/terminal-output-handler";
import { Colors } from "../../../../output-handler/typing/enums";
import { NodeWithSameNameExistsError } from "../../../components/__errors";
import { FileSystem} from "../../../components/file-system/file-system";
import type { Tokens } from "../../../core/__typing";
import { getCommandContext } from "../../../core/extract";
import { IncorrectArgumentsCountError} from "../../__errors";
import { AbstractCommand } from "../../AbstractCommand";
import { getPathContext } from "../../../components/file-system/getPathContext";

export class Mkdir extends AbstractCommand {
    public name: string = "mkdir";
    public flags: string[] = [];
    public options: string[] = [];

    public handleErrors(err: any): void {
        if (err instanceof IncorrectArgumentsCountError) {
            TerminalOutputHandler.standardErrorOutput([
                `IncorrectArgumentsCountError: This command only takes one argument!`,
                `Pass any paths with spaces inside quotations!`
            ])
            return;
        } if (err instanceof NodeWithSameNameExistsError){
            TerminalOutputHandler.standardErrorOutput([
                `NodeWithSameNameExistsError: A directory already exists at path ${addColor(err.path, Colors.yellow_light)}.`,
                `To overwrite existing directory, use the ${addColor('-f', Colors.blue_light)} flag.`
            ])
        }
    }

    protected __execute(tokens: Tokens) {
        const results = getCommandContext(tokens);
        if (results.remainingTokens.length != 1) throw new IncorrectArgumentsCountError(1, results.remainingTokens.length);

        const context = getPathContext(results.remainingTokens[0], __shell.globals.fs.currentDirectoryNode);

        
        const foundNode = FileSystem.getNodeByPath(context);
        if(foundNode !== undefined) throw new NodeWithSameNameExistsError(results.remainingTokens[0]);

        let createdNode;
        if(results.flags.includes('f')){
            createdNode = FileSystem.createDirectoryByPath(context, true);
        }
        else{
            createdNode = FileSystem.createDirectoryByPath(context, false);
        }

        if(results.flags.includes('c') || results.flags.includes("cd")){
            __shell.globals.fs.currentDirectoryNode = createdNode;
        }
        return;
    }

    public info(): string[] {
        return [
            "list contents of a directory with optional depth"
        ];
    }

    public usage(): string[] {
        return [
            "usage: ls [path] [options]",
            "",
            "Arguments:",
            `\t${addColor("[path]", Colors.yellow_light)} -> Optional. Path to the directory to list. Defaults to current directory if omitted.`,
            "",
            "Options:",
            `\t${addColor("--depth", Colors.yellow_light)}, ${addColor("-d", Colors.yellow_light)} : Optional. How deep to traverse the directory tree.`,
            `\t\t\t\t\t\t\t\t  Accepts a number or the keyword ${addColor("inf", Colors.yellow_light)}.`,
            "",
            "Examples:",
            `\t${addColor("ls", Colors.blue_light)} => Lists contents of the current directory`,
            `\t${addColor("ls ./docs", Colors.blue_light)} => Lists contents of the 'docs' directory`,
            `\t${addColor("ls -d 2", Colors.blue_light)} => Lists contents of the current directory up to depth 2`,
            `\t${addColor("ls root/projects -d inf", Colors.blue_light)} => Recursively lists everything under 'root/projects'`
        ];
    }


}