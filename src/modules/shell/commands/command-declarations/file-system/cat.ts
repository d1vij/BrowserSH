import { SHELL } from "../../../../../main";
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



export class Cat extends AbstractCommand {
    public name: string = "cat";
    public flags: string[] = [];
    public options: string[] = [];

    protected __execute(tokens: Tokens): void {
        const results = getCommandContext(tokens);
        if (results.remainingTokens.length != 1) throw new IncorrectArgumentsCountError(1, results.remainingTokens.length);

        const path = results.remainingTokens[0].trim();
        const context = getPathContext(path, SHELL.globals.fs.currentDirectoryNode);
        const node = FileSystem.getNodeByPath(context);

        if (node === undefined) throw new NodeNotFoundError(path);
        if (node.type === "directory") throw new NodeIsDirectoryError(path);

        const content = (node as FileNode).content;

        TerminalOutputHandler.printToTerminal(content);
    }

    public handleErrors(err: any): void {
        if (err instanceof IncorrectArgumentsCountError) {
            TerminalOutputHandler.standardErrorOutput([
                `IncorrectArgumentsCountError: This command takes ${err.expected} argument but passed were ${err.got}!`,
                `Pass any paths with spaces inside quotations!`
            ])

        } else if (err instanceof NodeIsDirectoryError) {
            TerminalOutputHandler.standardErrorOutput([
                `Cannot show content of node at ${err.path}! Path refers to a directory.`
            ])
        } else if (err instanceof NodeNotFoundError) {
            TerminalOutputHandler.standardErrorOutput([
                `No node found at path ${err.path}`
            ])
        }
    }
    public info(): string[] {
        return [
            "Print the contents of a file to the terminal.",
            "",
            "Arguments:",
            `\t${addColor("<path>", Colors.yellow_light)} : Path to the target file (relative or absolute).`
        ];
    }

    public usage(): string[] {
        return [
            "usage: cat <path>",
            "",
            "Path formats supported:",
            `\t${addColor(".", Colors.yellow_light)} / ${addColor("..", Colors.yellow_light)} -> self / parent directory traversal`,
            `\t${addColor("#/path/to/file.txt", Colors.yellow_light)} -> absolute path from root`,
            `\t${addColor("nested/file.txt", Colors.yellow_light)} -> relative path from current directory`,
            "",
            "Examples:",
            `\t${addColor("cat hello.txt", Colors.blue_light)}\t\t=> prints contents of 'hello.txt' in current directory`,
            `\t${addColor("cat ./docs/readme.md", Colors.blue_light)}\t=> prints contents of './docs/readme.md'`,
            `\t${addColor("cat @/files/data.json", Colors.blue_light)}\t=> prints contents of 'root/files/data.json'`
        ];
    }


}