import { Colors } from "../../../output-handler/colors";
import { EmbedExternalWebsites } from "../../../ui/embed-websites-factory";
import { LoaderFactory } from "../../../ui/loader";
import type { Tokens } from "../../core/typing";
import { AbstractCommand } from "../AbstractCommand";


export class __tmp extends AbstractCommand {
    public name = "clear";
    public flags: string[] = []
    public options: string[] = []

    protected async __execute(_: Tokens) {
        const l = new LoaderFactory("Loading Site", 150, "line", Colors.blue_cool);

        // const site = new EmbedExternalWebsites("https://d1vij.github.io/badui-birthday-guesser/");
        const site = new EmbedExternalWebsites("https://en.wikipedia.org/wiki/Main_Page");
        await l.startLoadingFor(1000, false);
        const p = site.embed();
        await p;
    }

    public info(): string[] {
        return [`clears terminal screen`];
    }

    public usage(): string[] {
        return [`usage: clear`];
    }
    protected handleErrors(err: any): void {
        console.log(err);
    }
}