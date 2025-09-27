import { SHELL } from "../../../main";
import { addColor } from "../../../output-handler/formatter";
import { TerminalOutputHandler } from "../../../output-handler/terminal-output-handler";
import { Colors } from "../../../output-handler/colors";
import type { Tokens } from "../../core/__typing";
import { getCommandContext } from "../../core/extract";
import { IncorrectArgumentsCountError, InvalidListableItemError } from "../errors";
import { AbstractCommand } from "../AbstractCommand"
import { commandIndex } from "../command-index";

export class List extends AbstractCommand {
    public name: string = "list";
    public flags: string[] = [];
    public options: string[] = [];

    public listables: Array<string> = ["commands", "listables", "colors", "variables"]

    protected __execute(tokens: Tokens): void {
        const results = getCommandContext(tokens);
        if (results.remainingTokens.length != 1) throw new IncorrectArgumentsCountError(1, results.remainingTokens.length);

        const toList = results.remainingTokens[0];

        let content: Array<string>;
        switch (toList) {
            case "commands":
                content = commandIndex.keys().toArray();
                break;

            case "listables": {
                content = this.listables;
                break;
            }
            case "variables": {
                content = SHELL.globals.vars.variables.keys().toArray();
                break;
            }
            case "colors": {
                content = Object.keys(Object(Colors));
                break;
            }
            default:
                throw new InvalidListableItemError(toList);
        }

        TerminalOutputHandler.printToTerminal(content);
        return;
    }

    protected handleErrors(err: any): void {
        if (err instanceof InvalidListableItemError) {
            TerminalOutputHandler.standardErrorOutput([
                `InvalidListableItemError: The item ${addColor(err.itemName, Colors.yellow_light)} is not listable!`,
                `use ${addColor("list listables", Colors.blue_light)} to view all listable items.`
            ])
        } else if (err instanceof IncorrectArgumentsCountError) {
            TerminalOutputHandler.standardErrorOutput([
                `IncorrectArgumentsCountErrror: This command takes atmost 1 arguments, but pass were ${err.got}`
            ])
        }
    }

    public info(): string[] {
        return [
            "list various internal items like commands, colors, etc."
        ];
    }

    public usage(): string[] {
        return [
            "usage: list <item>",
            "",
            "Arguments:",
            `\t<item> -> Type of content to list. Only specific keywords are accepted.`,
            "",
            "Listable items:",
            `\t${addColor("listables", Colors.yellow_light)} -> Lists all valid items that can be passed to 'list'`,
            "",
            "Examples:",
            `\t${addColor("list commands", Colors.blue_light)} => Displays all available commands`,
            `\t${addColor("list listables", Colors.blue_light)} => Displays all valid listable categories`
        ];
    }



}