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

/**
 * Handles empty entered line, not to be directly access by user
 */
export class NullCommand{ 
    public static flags: string[] = [] = [];
    public static options: string[] = [];
    public static subcommands: string[] = [];
    public static primary = "null";
    
    public static execute(_: TParsedCommand): void {
        return ;
    }
    
    public static info(): string {
        return `${addColor("you should not use this :)", Colors.red)}`;
    }
    
    public static usage(): string {
        return `${addColor("you should not use this :)", Colors.red)}`;
    }
}