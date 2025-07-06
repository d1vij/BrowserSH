import {terminalLinesList, terminalInputFeild} from "../../../domElements"
import type { TParsedCommand } from "../../shell/typing/types";
import { addColor } from "../../output-handler/formatter";
import { Colors } from "../../output-handler/typing/enums";

export function clear(){
    //clears terminal as well as user input field
    terminalLinesList.innerHTML = "";
    terminalInputFeild.value = "";
    return ;
}

export class Clear{ 
    public static primary = "clear"
    public static flags: string[] = [] = [];
    public static options: string[] = [];
    public static subcommands: string[] = [];
    
    public static execute(_: TParsedCommand): void {
        terminalLinesList.innerHTML = "";
        terminalInputFeild.value = "";
        return ;
    }
    
    public static info(): string {
        return `${addColor("clear", Colors.blue_cool)}: clears terminal screen`;
    }
    
    public static usage(): string {
        return `${addColor("clear", Colors.blue_cool)}`;
    }
}