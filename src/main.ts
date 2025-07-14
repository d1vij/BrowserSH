import { terminalInputFeild } from "./domElements"
import { updatePrimaryPrompt } from "./modules/output-handler/formatter";
import { Shell } from "./modules/shell/core/shell";


export let __shell: Shell;
window.onload = start;


function start(){
    console.log("starting")
    __shell = new Shell();
    updatePrimaryPrompt();
    terminalInputFeild.addEventListener("keypress", (event: Event) => {
        if ((event as KeyboardEvent).key == "Enter") {
            event.preventDefault();
            __shell.process();
        }
    })
}
