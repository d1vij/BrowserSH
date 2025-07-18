import { terminalInputFeild } from "./dom-elements"
import { Shell } from "./modules/shell/core/shell";
import { startupConfig } from "./startup";


// shell is used as an singleton throughout the program
export let __shell: Shell;

window.onload = start;

// setup initial content for the shell and hookup eventlistener to the input feild
function start(){
    console.log("starting")
    __shell = new Shell();
    startupConfig();
    terminalInputFeild.addEventListener("keypress", (event: KeyboardEvent) => {
        if (event.key == "Enter") {
            event.preventDefault();
            __shell.process();
        }
    })
}
