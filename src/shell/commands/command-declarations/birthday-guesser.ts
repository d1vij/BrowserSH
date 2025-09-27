import { EmbedExternalWebsites } from "../../../ui/embed-websites-factory";
import type { Tokens } from "../../core/__typing";
import { AbstractCommand } from "../AbstractCommand";


export class BirthdayGuesser extends AbstractCommand {
    public name = "clear";
    public flags: string[] = []
    public options: string[] = []

    protected async __execute(_: Tokens) {
        const site = new EmbedExternalWebsites("https://d1vij.github.io/badui-birthday-guesser/");
        await site.embed()
    }

    public info(): string[] {
        return [`Opens the birthday guesser game (https://d1vij.github.io/badui-birthday-guesser/)`];
    }

    public usage(): string[] {
        return [`usage: birthday-guesser`];
    }
    protected handleErrors(err: any): void {
        console.log(err);
    }
}