// import { addColor, OutputTemplates } from "../../output-handler/formatter";
// import { TerminalOutputHandler } from "../../output-handler/terminal-output-handler";
// import { Colors } from "../../output-handler/typing/enums";
// import type { TParsedCommand } from "../../parser/typing/types";
// import { GenericError } from "../errors";

// export class Redirect{
//     public static primary = "redirect";
//     public static flags = ['s','same_tab'];
//     public static options = ['url'] as string[];
//     public static subcommands = [] as string[];

//     public static execute(parsed: TParsedCommand){
//         throw new Error("Not implemented");
//         if("url" in Object.keys(parsed.options)){
            
//         } else {

//         }
//     }
//     private static redirector(url:string, tab:"same"|"new"){
//         const target = (tab == "same") ? "" : "";
//         if(window.open(url, "_blank")?.focus() == null){
//             new GenericError(`Unable to open url ${url}`);
//             return;
//         } else {
//             TerminalOutputHandler.printToTerminal(OutputTemplates.standardTerminalOutput(addColor("Redirect success !!", Colors.green_swamp)));
//         }
//     }
    
//     public static info(){
//         return "TO IMPLEMENT"
//     }
//     public static usage(){
//         return "TO IMPLEMENT"
//     }
// }

