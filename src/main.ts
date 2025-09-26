import { terminalInputFeild, unsupportedMessage, windowDiv } from "./dom-elements"
import { handleInput } from "./input-key-handler";
import { Shell } from "./shell/core/shell";
import { startupConfig } from "./startup";


// shell is used as an singleton throughout the program
export let SHELL: Shell;

window.onload = start;

// disallowing mobile devices for sake of compatibility
const isMobile = (()=> {
    const nav = navigator as Navigator & { userAgentData?: { mobile: boolean } };
    if (nav.userAgentData) return nav.userAgentData.mobile; 
    return /Mobi|Android/i.test(navigator.userAgent);
})()

function start() {
    if(isMobile){
        windowDiv.style.display = "none";
        unsupportedMessage.style.display = "block";
    }
    console.log("starting")
    SHELL = new Shell();
    startupConfig(()=>{
        terminalInputFeild.addEventListener("keydown",handleInput);
    });
}
