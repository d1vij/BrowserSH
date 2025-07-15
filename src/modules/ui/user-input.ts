import { nanoid } from "nanoid";
import { terminalLinesList } from "../../domElements";

const template = document.getElementById("ui-user-input") as HTMLTemplateElement;



// TODO: refactor
export function takeUserInput(prompt: string): Promise<string | undefined> {
    return new Promise((resolve) => {
        const clone = template.content.cloneNode(true) as DocumentFragment;

        const __id = nanoid();
        const container = clone.querySelector<HTMLLIElement>(".ui-user-input-container")!;
        container.id = __id;

        const promptFeild = clone.querySelector<HTMLDivElement>(".ui-user-input-prompt")!;
        promptFeild.setAttribute("data-belongs-to", __id);
        promptFeild.innerText = prompt; //TODO: add html escaping

        const inputFeild = clone.querySelector<HTMLDivElement>(".ui-user-input-feild")!;
        inputFeild.setAttribute("data-belongs-to", __id);

        inputFeild.addEventListener("keypress", function handleUserinput(event:KeyboardEvent){
            if (event.key !== "Enter") return;
            
            event.preventDefault();
            const target = event.target as HTMLDivElement;

            target.removeEventListener("keypress",handleUserinput);

            const userInput = target.innerText;
            
            container.remove();
            // TerminalOutputHandler.printToTerminal(OutputTemplates.standardTerminalOutput(`${prompt} : ${userInput}`));
            
            if (userInput === "") resolve(undefined);
            else resolve(userInput)
        });
        terminalLinesList.appendChild(clone);
        inputFeild.focus();
    })
}