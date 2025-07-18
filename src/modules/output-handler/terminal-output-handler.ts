import { Colors } from "./typing/enums";
import { addColor, OutputTemplates } from "./formatter";
import {terminalContentDiv,terminalLinesList} from "../../dom-elements"

function scrollToEnd(){
    terminalContentDiv.scrollTop = terminalContentDiv.scrollHeight;
}

/**
 * Static class to handle any output to be done to the terminal frontend
 * Terminal output is handled by printToTerminal()
 * Error output is handled by standardErrorOutput()
 */
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

    /**
     * Clears terminal
     */
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