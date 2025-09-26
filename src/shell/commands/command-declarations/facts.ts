import { addColor } from "../../../output-handler/formatter";
import { TerminalOutputHandler } from "../../../output-handler/terminal-output-handler";
import { Colors } from "../../../output-handler/typing/enums";
import { LoaderFactory } from "../../../ui/loader";
import type { Tokens } from "../../core/__typing";
import { test_isInteger } from "../../core/checks";
import { getCommandContext } from "../../core/extract";
import { pause } from "../../core/pause";
import { AbstractCommand } from "../AbstractCommand";


/**
 * facts 
 * facts --count 2 
 */


const url = "https://uselessfacts.jsph.pl/api/v2/facts/random"


export class Facts extends AbstractCommand {
    public flags: string[] = [];
    public name: string = "facts";
    public options: string[] = ["count"];
    public info(): string[] {
        return [
            "Fetches and displays random facts"
        ];
    }

    public usage(): string[] {
        return [
            "usage: facts [options]",
            "",
            "Options include:",
            `\t${addColor("count", Colors.yellow_light)} : number of facts to fetch (default = 1)`,
            "",
            "Examples:",
            `\t facts\t\t\t\t=> Fetches and displays 1 random fact`,
            `\t facts --count 3\t\t=> Fetches and displays 3 random facts`,
            `\t facts --count 10\t\t=> Fetches and displays 10 random facts`,
        ];
    }
    public handleErrors(err: any): void {
        TerminalOutputHandler.printToTerminal(`Error occured while fetching : ${err.name}`);
    }
    protected async __execute(tokens: Tokens): Promise<void> {
        const results = getCommandContext(tokens);
        const foundCount = results.options["count"];
        if (foundCount === undefined) {
            TerminalOutputHandler.printToTerminal("No count found, defaulting to 1");
        } else if (test_isInteger(foundCount, false) == false) {
            // number is not an integer or is negative
            TerminalOutputHandler.printToTerminal(addColor("Count must be integral", Colors.red));
            return;
        }

        const count = parseInt(foundCount) || 1;
        if (count <= 0) {
            TerminalOutputHandler.printToTerminal(addColor("Count must be non zero postive integer", Colors.red));
            return;
        }
        const l = new LoaderFactory("Fetching facts...", 150, "line", Colors.green_dark);
        l.startLoading();

        const quotes: string[] = [];
        const promises = [];
        for (let i = 0; i < count; i++) {
            promises.push((async () => {
                const response = await fetch(url);
                const json = await response.json();
                quotes.push(addColor('* ', Colors.purple_wine) + json["text"]);
            })())
        }
        await pause(2500);
        await Promise.all(promises);
        l.stopLoading();
        TerminalOutputHandler.printToTerminal(quotes);
    }
}