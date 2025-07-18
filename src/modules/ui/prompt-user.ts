import { terminalLinesList, takeUserInputTemplate } from "../../dom-elements";
import { TerminalOutputHandler } from "../output-handler/terminal-output-handler";


/**
 * Allows to take user input on demand, mid-command execution.
 * @param {string} prompt : The question / prompt to ask input for
 * @param {boolean} [multiline=false] : Wether the input should be multiline ?.
 * If true, users can do shift+enter to go to next line without submitting the prompt
 * @param {boolean} [inputPreview=false] : Wether to display the prompt preview upon submission ?
 * 
 * Usage:
 * Anywhere in command, 
 *      const response = await promptUser("Whats your name ? :") //Whats your name ? : Foo
 */
export function promptUser(prompt: string, multiline:boolean = false, inputPreview:boolean = false): Promise<string | undefined> {
    return new Promise((resolve) => {
        const clone = takeUserInputTemplate.content.cloneNode(true) as DocumentFragment;
        
        // TODO: Rename class names in css and html template
        const container = clone.querySelector<HTMLLIElement>(".ui-user-input-container")!;
        const inputFeild = clone.querySelector<HTMLDivElement>(".ui-user-input-feild")!;
        const promptFeild = clone.querySelector<HTMLDivElement>(".ui-user-input-prompt")!;

        promptFeild.innerText = prompt; //TODO: add html escaping
        
        
        inputFeild.addEventListener("keypress", function handleUserinput(event:KeyboardEvent){
            if(multiline && event.key === "Enter" && event.shiftKey) return;
            if (event.key !== "Enter") return;
            
            event.preventDefault();
            const target = event.target as HTMLDivElement;
            
            target.removeEventListener("keypress",handleUserinput);
            
            const userInput = target.innerText;
            
            container.remove();
            
            // eh maybe remove 
            if(inputPreview == true) TerminalOutputHandler.printToTerminal(`${prompt} : ${userInput}`);
            
            if (userInput === "") resolve(undefined);
            else resolve(userInput)
        });
        terminalLinesList.appendChild(clone);
        inputFeild.focus();
    })
}