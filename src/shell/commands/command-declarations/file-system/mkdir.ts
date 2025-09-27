import { SHELL } from "../../../../main";
import { addColor } from "../../../../output-handler/formatter";
import { TerminalOutputHandler } from "../../../../output-handler/terminal-output-handler";
import { Colors } from "../../../../output-handler/colors";
import { NodeWithSameNameExistsError } from "../../../components/__errors";
import { FileSystem } from "../../../components/file-system/file-system-core";
import type { Tokens } from "../../../core/typing";
import { getCommandContext } from "../../../core/extract";
import { IncorrectArgumentsCountError } from "../../errors";
import { AbstractCommand } from "../../AbstractCommand";
import { getPathContext } from "../../../components/file-system/getPathContext";

export class Mkdir extends AbstractCommand {
    public name: string = "mkdir";
    public flags: string[] = ['c', 'f'];
    public options: string[] = [];

    protected handleErrors(err: any): void {
        if (err instanceof IncorrectArgumentsCountError) {
            TerminalOutputHandler.standardErrorOutput([
                `IncorrectArgumentsCountError: This command only takes one argument!`,
                `Pass any paths with spaces inside quotations!`
            ])
            return;
        } if (err instanceof NodeWithSameNameExistsError) {
            TerminalOutputHandler.standardErrorOutput([
                `NodeWithSameNameExistsError: A directory already exists at path ${addColor(err.path, Colors.yellow_light)}.`,
                `To overwrite existing directory, use the ${addColor('-f', Colors.blue_light)} flag.`
            ])
        }
    }

    protected __execute(tokens: Tokens) {
        const results = getCommandContext(tokens);
        if (results.remainingTokens.length != 1) throw new IncorrectArgumentsCountError(1, results.remainingTokens.length);

        const context = getPathContext(results.remainingTokens[0], SHELL.globals.fs.currentDirectoryNode);


        const foundNode = FileSystem.getNodeByPath(context);
        if (foundNode !== undefined) throw new NodeWithSameNameExistsError(results.remainingTokens[0]);

        let createdNode;
        if (results.flags.includes('f')) {
            createdNode = FileSystem.createDirectoryByPath(context, true);
        }
        else {
            createdNode = FileSystem.createDirectoryByPath(context, false);
        }

        if (results.flags.includes('c')) {
            SHELL.globals.fs.currentDirectoryNode = createdNode;
        }
        return;
    }

    public info(): string[] {
        return [
            "create a new directory (optionally force overwrite or change into it)"
        ];
    }

    public usage(): string[] {
        return [
            `usage: mkdir ${addColor("[path]", Colors.yellow_light)} [flags]`,
            "",
            "Arguments:",
            `\t${addColor("[path]", Colors.yellow_light)} -> Required. Path where the new directory should be created.`,
            "",
            "Flags:",
            `\t${addColor("-f", Colors.yellow_light)} : Force create. Overwrites existing directory if it already exists.`,
            `\t${addColor("-c", Colors.yellow_light)} : Change directory into the newly created folder.`,
            "",
            "Examples:",
            `\t${addColor("mkdir docs", Colors.blue_light)} => Creates a new directory called 'docs' in the current directory`,
            `\t${addColor("mkdir -f docs", Colors.blue_light)} => Creates 'docs', overwriting if it already exists`,
            `\t${addColor("mkdir -c projects", Colors.blue_light)} => Creates 'projects' and moves into it immediately`
        ];
    }

}