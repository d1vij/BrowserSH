import { __shell } from "../../../../main";
import { addColor } from "../../../output-handler/formatter";
import { TerminalOutputHandler } from "../../../output-handler/terminal-output-handler";
import { Colors } from "../../../output-handler/typing/enums";
import { NotepadFactory } from "../../../ui/notepad-factory";
import { NodeIsDirectoryError, NodeWithSameNameExistsError } from "../../components/__errors";
import type { FileNode } from "../../components/__typing";
import { FileSystem } from "../../components/file-system/file-system";
import { getPathContext } from "../../components/file-system/getPathContext";
import type { Tokens } from "../../core/__typing";
import { getCommandContext } from "../../core/extract";
import {  IncorrectArgumentsCountError, InvalidOptionError, NodeNotFoundError } from "../__errors";
import { AbstractCommand } from "../AbstractCommand";

export class Notepad extends AbstractCommand {
    public name = "notepad";
    public options: string[] = ['o', "open", 'n', "new"];
    public flags: string[] = [];

    public handleErrors(err: any): void {
        if (err instanceof NodeIsDirectoryError) {
            TerminalOutputHandler.standardErrorOutput([
                `Cannot open path ${addColor(err.path, Colors.yellow_light)}, path refers to a directory!`
            ])
        } else if (err instanceof InvalidOptionError) {
            TerminalOutputHandler.standardErrorOutput([
                err.optionName === "open"
                    ? `No path provided to open!`
                    : `No path provided to create a file to!`
            ])
        } else if (err instanceof IncorrectArgumentsCountError){
            TerminalOutputHandler.standardErrorOutput([
                `Incorrect usage, use ${addColor("help notepad", Colors.blue_cool)} for usage.`
            ])
        }
    }

    protected async __execute(tokens: Tokens): Promise<void> {
        const results = getCommandContext(tokens);
        // Typical shell expects `-o path` or `-n path` (not mixing)
        let path: string | undefined;

        if (results.options.o || results.options.open) {
            // notepad --open <path>
            path = results.options.o || results.options.open;
            if (!path) throw new InvalidOptionError("open");

            const node = FileSystem.getNodeByPath(getPathContext(path, __shell.globals.fs.currentDirectoryNode));
            if (!node) throw new NodeNotFoundError(path);
            if (node.type === "directory") throw new NodeIsDirectoryError(path);

            const fileNode = node as FileNode;
            const npd = new NotepadFactory(fileNode.content || "", fileNode.name);
            const content = await npd.getContent();
            fileNode.content = content;
            return;
        } else if (results.options.n || results.options.new) {
            // notepad --new <path>
            path = results.options.n || results.options.new;
            if (!path) throw new InvalidOptionError("new");

            const existingNode = FileSystem.getNodeByPath(getPathContext(path, __shell.globals.fs.currentDirectoryNode));
            if (existingNode) throw new NodeWithSameNameExistsError(path);

            const createdNode = FileSystem.createFileByPath(path, __shell.globals.fs.currentDirectoryNode);
            const npd = new NotepadFactory("", createdNode.name);
            const content = await npd.getContent();
            createdNode.content = content;
            return;
        } else {
            // Fallback: check if user provided positional argument
            if (results.remainingTokens.length === 1) {
                // Assume open mode as fallback
                path = results.remainingTokens[0];
                const node = FileSystem.getNodeByPath(getPathContext(path, __shell.globals.fs.currentDirectoryNode));
                if (!node) throw new NodeNotFoundError(path);
                if (node.type === "directory") throw new NodeIsDirectoryError(path);

                const fileNode = node as FileNode;
                const npd = new NotepadFactory(fileNode.content || "", fileNode.name);
                const content = await npd.getContent();
                fileNode.content = content;
                return;
            }
            throw new IncorrectArgumentsCountError(1,0); // No recognized flags/options provided
        }
    }
    public info(): string[] {
        return [
            "Edit or create a file using the terminal notepad interface.",
        ];
    }

    public usage(): string[] {
        return [
            "usage: notepad (--open <path> | -o <path> | --new <path> | -n <path> | <path>)",
            " ",
            "Options:",
            `\t${addColor("o | open", Colors.yellow_light)} <path>\tOpen an existing file for editing`,
            `\t${addColor("n | new", Colors.yellow_light)} <path>\tCreate a new file and edit it`,
            " ",
            "Examples:",
            `\t notepad --open foo.txt\t\t\tOpen file named foo.txt`,
            `\t notepad -o docs/notes.md\t\tOpen a file in a subdirectory`,
            `\t notepad --new report.txt\t\tCreate a new file named report.txt and edit`,
            `\t notepad -n diary/2024-06-05.md\tCreate new nested file if path allows`,
            `\t notepad bar.txt\t\t\t\tOpen bar.txt (same as --open)`,
        ];
    }
}

