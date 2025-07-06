import {
    terminalInputFeild
} from "./domElements"
import { process } from "./process";

terminalInputFeild.addEventListener("keypress", (event:Event)=>{
    if((event as KeyboardEvent).key == "Enter"){
        event.preventDefault();
        // console.log("enter pressed")
        process();
    }
})
// 


import { GlobalsFactory } from "./modules/shell/components/globals-factory";
export const Global = new GlobalsFactory();