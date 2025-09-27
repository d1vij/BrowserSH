import { SHELL } from "../../../../main";
import { addColor } from "../../../../output-handler/formatter";
import { TerminalOutputHandler } from "../../../../output-handler/terminal-output-handler";
import { Colors } from "../../../../output-handler/colors";
import { FileSystem } from "../../../components/file-system/file-system-core";
import type { Tokens } from "../../../core/__typing";
import { getCommandContext } from "../../../core/extract";
import { IncorrectArgumentsCountError, InvalidNumberError } from "../../errors";
import { AbstractCommand } from "../../AbstractCommand";
import { getPathContext } from "../../../components/file-system/getPathContext";

export class Ls extends AbstractCommand {
    public name: string = "ls";
    public flags: string[] = [];
    public options: string[] = ["depth"];

    protected __execute(tokens: Tokens) {
        const results = getCommandContext(tokens);
        if (results.remainingTokens.length >= 2) throw new IncorrectArgumentsCountError("0 or 1", results.remainingTokens.length);

        const path = results.remainingTokens[0] || "."
        const context = getPathContext(path, SHELL.globals.fs.currentDirectoryNode);

        let depth: number | string = results.options["depth"] || "1";

        if (depth === "inf") {
            depth = Infinity;
        } else {
            depth = parseInt(depth);
            if (!Number.isInteger(depth)) throw new InvalidNumberError(depth.toString());
        }

        const dirTree = FileSystem.traverseAndList(context, depth);
        TerminalOutputHandler.printToTerminal(dirTree);

        return;
    }


    public handleErrors(err: any): void {
        if (err instanceof InvalidNumberError) {

            TerminalOutputHandler.standardErrorOutput([
                `InvalidNumberError: Error in parsing ${addColor(err.num, Colors.yellow_light)}. Enter a valid number`
            ]);
        }
        else if (err instanceof IncorrectArgumentsCountError) {
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
            "usage: ls [--depth=N | --depth=inf]",
            "",
            "Options:",
            `\t--depth N -> Depth of traversal. Defaults to 1.`,
            `\t--depth inf -> Traverse infinitely deep.`,
            "",
            "Description:",
            "\tLists contents of a directory. Supports optional depth control.",
            "",
            "Examples:",
            `\t${addColor("ls", Colors.blue_light)} => Lists current directory (depth 1)`,
            `\t${addColor("ls --depth 2", Colors.blue_light)} => Lists current directory with depth 2`,
            `\t${addColor("ls --depth inf", Colors.blue_light)} => Lists everything under current directory recursively`
        ];
    }


}