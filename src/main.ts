import {terminalInputFeild} from "./domElements"
import { Shell } from "./modules/shell/core/shell";

export const __shell = new Shell();


terminalInputFeild.addEventListener("keypress", (event:Event)=>{
    if((event as KeyboardEvent).key == "Enter"){
        event.preventDefault();
        console.log("enter pressed")
        __shell.process()
    }
})

