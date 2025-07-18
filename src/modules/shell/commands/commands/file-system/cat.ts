import { __shell } from "../../../../../main";
import { addColor } from "../../../../output-handler/formatter";
import { TerminalOutputHandler } from "../../../../output-handler/terminal-output-handler";
import { Colors } from "../../../../output-handler/typing/enums";
import { NodeIsDirectoryError } from "../../../components/__errors";
import type { FileNode } from "../../../components/__typing";
import { FileSystem } from "../../../components/file-system/file-system";
import type { Tokens } from "../../../core/__typing";
import { getCommandContext } from "../../../core/extract";
import { IncorrectArgumentsCountError, NodeNotFoundError } from "../../__errors";
import { AbstractCommand } from "../../AbstractCommand";
import { getPathContext } from "../../../components/file-system/getPathContext";



export class Cat extends AbstractCommand{
    public name: string = "cat";
    public flags: string[] = [];
    public options: string[] = [];

    protected __execute(tokens: Tokens): void{
        const results = getCommandContext(tokens);
        if (results.remainingTokens.length != 1) throw new IncorrectArgumentsCountError(1, results.remainingTokens.length);
        
        const path = results.remainingTokens[0].trim();
        const context = getPathContext(path, __shell.globals.fs.currentDirectoryNode);
        const node = FileSystem.getNodeByPath(context);
        
        if (node === undefined) throw new NodeNotFoundError(path);
        if (node.type === "directory") throw new NodeIsDirectoryError(path);
        
        const content = (node as FileNode).content;

        TerminalOutputHandler.printToTerminal(content);
    }
    
    public handleErrors(err: any): void {
        if(err instanceof IncorrectArgumentsCountError){
            TerminalOutputHandler.standardErrorOutput([
                `IncorrectArgumentsCountError: This command takes ${err.expected} argument but passed were ${err.got}!`,
                `Pass any paths with spaces inside quotations!`
            ])

        } else if(err instanceof NodeIsDirectoryError){
            TerminalOutputHandler.standardErrorOutput([
                `Cannot show content of node at ${err.path}! Path refers to a directory.`
            ])
        } else if(err instanceof NodeNotFoundError){
            TerminalOutputHandler.standardErrorOutput([
                `No node found at path ${err.path}`
            ])
        }
    }
    public info(): string[] {
        return [
            "print the contents of a file to the terminal"
        ];
    }

    public usage(): string[] {
        return [
            "usage: cat <path>",
            "",
            "Arguments:",
            `\t<path> -> Path to the target file. Can be relative or absolute.`,
            "",
            "Path formats supported:",
            `\t${addColor(".", Colors.yellow_light)} / ${addColor("..", Colors.yellow_light)} -> For self and parent directory traversal`,
            `\t${addColor("#/path/to/file.txt", Colors.yellow_light)} -> Absolute path starting from root`,
            `\t${addColor("some/nested/file.txt", Colors.yellow_light)} -> Relative path from current directory`,
            "",
            "Examples:",
            `\t${addColor("cat hello.txt", Colors.blue_light)} => Prints contents of 'hello.txt' in the current directory`,
            `\t${addColor("cat ./docs/readme.md", Colors.blue_light)} => Prints contents of file at relative path './docs/readme.md'`,
            `\t${addColor("cat #/files/data.json", Colors.blue_light)} => Prints contents of absolute path 'root/files/data.json'`
        ];
    }

}