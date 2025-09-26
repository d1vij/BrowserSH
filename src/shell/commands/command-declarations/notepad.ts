import { SHELL } from "../../../main";
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
import { IncorrectArgumentsCountError, InvalidOptionError, NodeNotFoundError } from "../__errors";
import { AbstractCommand } from "../AbstractCommand";

export class Notepad extends AbstractCommand {
    public name = "notepad";
    public options: string[] = ["open", "new"];
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
        } else if (err instanceof IncorrectArgumentsCountError) {
            TerminalOutputHandler.standardErrorOutput([
                `Incorrect usage, use ${addColor("help notepad", Colors.blue_cool)} for usage.`
            ])
        }
    }

    // TODO: Refactor single dashed options
    protected async __execute(tokens: Tokens): Promise<void> {
        const results = getCommandContext(tokens);
        // Typical shell expects `-o path` or `-n path` (not mixing)
        let path: string | undefined;

        if (results.options.o || results.options.open) {
            // notepad --open <path>
            path = results.options.o || results.options.open;
            if (!path) throw new InvalidOptionError("open");

            const node = FileSystem.getNodeByPath(getPathContext(path, SHELL.globals.fs.currentDirectoryNode));
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

            const existingNode = FileSystem.getNodeByPath(getPathContext(path, SHELL.globals.fs.currentDirectoryNode));
            if (existingNode) throw new NodeWithSameNameExistsError(path);

            const createdNode = FileSystem.createFileByPath(path, SHELL.globals.fs.currentDirectoryNode);
            const npd = new NotepadFactory("", createdNode.name);
            const content = await npd.getContent();
            createdNode.content = content;
            return;
        } else {
            // Fallback: check if user provided positional argument
            if (results.remainingTokens.length === 1) {
                // Assume open mode as fallback
                path = results.remainingTokens[0];
                const node = FileSystem.getNodeByPath(getPathContext(path, SHELL.globals.fs.currentDirectoryNode));
                if (!node) throw new NodeNotFoundError(path);
                if (node.type === "directory") throw new NodeIsDirectoryError(path);

                const fileNode = node as FileNode;
                const npd = new NotepadFactory(fileNode.content || "", fileNode.name);
                const content = await npd.getContent();
                fileNode.content = content;
                return;
            }
            throw new IncorrectArgumentsCountError(1, 0); // No recognized flags/options provided
        }
    }
    public info(): string[] {
        return [
            "Edit or create a file using the terminal notepad interface.",
            "",
            "Options include:",
            `\t${addColor("--open", Colors.yellow_light)} <path> -> open the specified file`,
            `\t${addColor("--new", Colors.yellow_light)} <path>  -> create and edit the specified file`,
        ];
    }

    public usage(): string[] {
        return [
            "usage: notepad [flags] [options] [<path>]",
            "",
            "Examples:",
            `\t notepad --open foo.txt\t\t\t=> Open file named foo.txt`,
            `\t notepad -o docs/notes.md\t\t\t=> Open a file in a subdirectory`,
            `\t notepad --new report.txt\t\t\t=> Create a new file named report.txt and edit`,
            `\t notepad -n diary/2024-06-05.md\t\t=> Create new nested file if path allows`,
            `\t notepad bar.txt\t\t\t\t=> Open bar.txt (same as --open)`,
        ];
    }
}
