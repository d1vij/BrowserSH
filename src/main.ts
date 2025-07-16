import { terminalInputFeild } from "./domElements"
import { Shell } from "./modules/shell/core/shell";
import { startupConfig } from "./startup";


export let __shell: Shell;
window.onload = start;

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
