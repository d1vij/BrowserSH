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

    protected __execute(tokens: Tokens): void{
        const results = getCommandContext(tokens);
        const recurse = results.flags.includes('r');

        FileSystem.deleteNodeByPath(results.remainingTokens[0], __shell.globals.fs.currentDirectoryNode, recurse);
    }
    
    
    
    public handleErrors(err: any): void {
        if (err instanceof NodeToRemoveIsADirectoryAndNoRecurseFlagIsProvidedError) {
            TerminalOutputHandler.standardErrorOutput([
                `Target node is a directory and no recurse flag was used, skipping delete`,
                `Use ${addColor("-r", Colors.blue_light)} flag to remove directories.`
            ])
        } else if (err instanceof NodeNotFoundError) {
            TerminalOutputHandler.standardErrorOutput([
                `No node found at path ${err.path}`
            ])
        }
    }

    public info(): string[] {
        return [
            "delete a file or directory from the filesystem"
        ];
    }

    public usage(): string[] {
        return [
            "usage: rm <path> [flags]",
            "",
            "Arguments:",
            `\t${addColor("<path>", Colors.yellow_light)} -> Path to the file or directory to delete.`,
            "",
            "Flags:",
            `\t${addColor("-r", Colors.yellow_light)} -> Recursively deletes a directory and its contents.`,
            `\t\t\t   Must be used if the target is a directory.`,
            "",
            "Examples:",
            `\t${addColor("rm hello.txt", Colors.blue_light)} => Deletes the file 'hello.txt' from the current directory`,
            `\t${addColor("rm root/data/file.json", Colors.blue_light)} => Deletes the file at the given absolute path`,
            `\t${addColor("rm ./projects", Colors.blue_light)} => Fails if 'projects' is a directory (no -r flag used)`,
            `\t${addColor("rm ./projects -r", Colors.blue_light)} => Recursively deletes the 'projects' directory and its contents`
        ];
    }
}