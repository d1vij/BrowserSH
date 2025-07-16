import { nanoid } from "nanoid";
import { terminalLinesList, takeUserInputTemplate } from "../../domElements";
import { OutputTemplates } from "../output-handler/formatter";
import { TerminalOutputHandler } from "../output-handler/terminal-output-handler";

export function takeUserInput(prompt: string, multiline:boolean = false, inputPreview:boolean = false): Promise<string | undefined> {
    return new Promise((resolve) => {
        const clone = takeUserInputTemplate.content.cloneNode(true) as DocumentFragment;
        
        const __id = nanoid();
        const container = clone.querySelector<HTMLLIElement>(".ui-user-input-container")!;
        container.id = __id;
        
        const promptFeild = clone.querySelector<HTMLDivElement>(".ui-user-input-prompt")!;
        promptFeild.setAttribute("data-belongs-to", __id);
        promptFeild.innerText = prompt; //TODO: add html escaping
        
        const inputFeild = clone.querySelector<HTMLDivElement>(".ui-user-input-feild")!;
        console.log(inputFeild);    
        inputFeild.setAttribute("data-belongs-to", __id);
        
        inputFeild.addEventListener("keypress", function handleUserinput(event:KeyboardEvent){
            if(multiline && event.key === "Enter" && event.shiftKey) return;
            if (event.key !== "Enter") return;
            
            event.preventDefault();
            const target = event.target as HTMLDivElement;
            
            target.removeEventListener("keypress",handleUserinput);
            
            const userInput = target.innerText;
            
            container.remove();
            
            // eh maybe remove 
            if(inputPreview == true) TerminalOutputHandler.printToTerminal(OutputTemplates.standardTerminalOutput(`${prompt} : ${userInput}`));
            
            if (userInput === "") resolve(undefined);
            else resolve(userInput)
        });
        terminalLinesList.appendChild(clone);
        inputFeild.focus();
    })
}