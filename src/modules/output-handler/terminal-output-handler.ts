//modifies dom elements


import {
    terminalLinesList
} from "../../domElements"
import { addColor, OutputTemplates } from "./formatter";
import { Colors } from "./typing/enums";

export class TerminalOutputHandler{

    public static printToTerminal(content:string){
        terminalLinesList.innerHTML += content;
        return;
    }
    public static clearTerminal(){
        terminalLinesList.innerHTML = "";
        return;
    }
    public static commandNotFoundError(command:string){
        const errorMessage = addColor(`-${command} : command not found`, Colors.red);
        terminalLinesList.innerHTML += OutputTemplates.standardTerminalOutput(errorMessage);
        return;
    }
    
}