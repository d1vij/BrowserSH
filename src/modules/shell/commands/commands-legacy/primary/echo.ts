import { TerminalOutputHandler } from "../../output-handler/terminal-output-handler";
import { addColor, OutputTemplates, stringify } from "../../output-handler/formatter";
import { Colors } from "../../output-handler/typing/enums";

import type { TParsedCommand } from "../../shell/typing/types";
import { InvalidColorError } from "../errors";


export class Echo {
    public static primary = "echo";
    public static flags: string[] = ['r', "reverse"];
    public static options: string[] = ['color'];
    public static subcommands: string[] = [];

    
    public static execute(parsedCommand: TParsedCommand): void {
        let content: string | string[] = parsedCommand.arguments
        if(Array.isArray(content)){
            content = content.join(" ");
        }

        // flag parsing pehale cuz reverse flag would reverse the format-html too
        for(let flag of parsedCommand.flags){
            switch(flag){
                case "r":{
                    content = addColor(content, Colors.red);
                    break;
                }
                case "reverse":{
                    content = [...content].reverse().join("");
                    break;
                }
            }
        }
        for(let option of Object.keys(parsedCommand.options)){
            switch (option){
                case "color":{
                    const userColor = parsedCommand.options.color;
                    if(userColor in Colors === false) throw new InvalidColorError(userColor);
                    content = addColor(content, userColor);
                    break;
                }
            }
        }
        
        TerminalOutputHandler.printToTerminal(OutputTemplates.standardTerminalOutput(content));
    }

    public static info(): string{
        return `${addColor("echo", Colors.blue_cool)}: display a line of text`;
    }
    public static usage(): string {
        return stringify([
            `${addColor("echo", Colors.blue_cool)}:`,
            "\techo [SHORT-OPTION]... [STRING]...",
            "\techo LONG-OPTION"
        ])
    }
    
}
