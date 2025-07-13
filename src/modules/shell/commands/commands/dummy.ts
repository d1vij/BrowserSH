import { AbstractCommand } from "../AbstractCommand";

export class Dummy extends AbstractCommand {
    public name = "dummy";
    public flags: string[] = [];
    public options: string[] = [];

    public execute(): void {

    }
    public info(): string {
        return ""
    }
    public usage(): string {
        return ""
    }
    public handleErrors(err: any): void {
        
    }
}

