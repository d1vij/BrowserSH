//modifies dom elements


import {
    terminalContentDiv,
    terminalLinesList
} from "../../domElements"
import { addColor, OutputTemplates } from "./formatter";
import { Colors } from "./typing/enums";

function scrollToEnd(){
    terminalContentDiv.scrollTop = terminalContentDiv.scrollHeight;
}

export class TerminalOutputHandler{

    public static printToTerminal(content:string | string[]): void{
        terminalLinesList.innerHTML += OutputTemplates.standardTerminalOutput(content);
        scrollToEnd();
        return;
    }

    
    public static printToTerminalOld(content:string){
        // TODO: refactor usages to new printToTerminal
        terminalLinesList.innerHTML += content;
        scrollToEnd();
        return;
    }
    public static clearTerminal(){
        terminalLinesList.innerHTML = "";
        return;
    }
    
    public static standardErrorOutput(errorMessages: Array<string>) {
        terminalLinesList.innerHTML += OutputTemplates.standardTerminalOutput(errorMessages!.map(ln => addColor(ln, Colors.red)));
        scrollToEnd();
        return;
    }
}