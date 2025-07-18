import { notepadTemplate, terminalLinesList } from "../../dom-elements";
import { SPACE } from "../shell/core/shell";

let hovertimeout: NodeJS.Timeout;
let count = 4;
let INDENT = " ".repeat(count);

// ms after which the indent hover options should disapper once the mouse leaves the it
const TIMEOUT_DELAY = 1000; 

/**
 * The NotepadFactory class instantiates and manages a standalone notepad/ text-editor popup inside the web terminal.
 * It enables text editing, and allows configurable tab indentation, and integrates cleanly with the terminal's DOM output.
 * A new "notepad window" can be opened by any other module as well.
 * 
 * A new notepad instance is created with two parameters
 * @param {string} preExistingContent : Any pre-existing content for the notepad to start with
 * @param {string} fileName : Name of file
 * 
 * Usage:
 *      const npd = new NotepadFactory("", "test.txt"); //File name is totally irrelevant as this class doesnt handle the save logic
 *      const content = await npd.getContent(); //Anything user submits from the notepad
 */
export class NotepadFactory {

    private npdWindow;
    private npdInput;
    private npdSaveCloseButton;
    private npdIndentSpacesButton;
    private npdIndentSpacesSelect;
    private npdIndentSpacesPreview;
    private npdFileName;
    private resolveInput: null | ((content:string) => void);

    private inserted: boolean = false;
    
    public constructor(preExistingContent:string = "", fileName:string) {
        const clone = notepadTemplate.content.cloneNode(true) as DocumentFragment;

        this.npdWindow = clone.querySelector("div.ui-notepad-window") as HTMLDivElement;
        this.npdInput = clone.querySelector("textarea.ui-notepad-inputregion") as HTMLTextAreaElement;
        this.npdSaveCloseButton = clone.querySelector("span.ui-notepad-save-and-close-button") as HTMLDivElement;
        this.npdIndentSpacesButton = clone.querySelector(".ui-notepad-tab-spaces-button") as HTMLDivElement;
        this.npdIndentSpacesSelect = clone.querySelector(".ui-notepad-tab-spaces-select") as HTMLDivElement;
        this.npdIndentSpacesPreview = clone.querySelector("span.selected") as HTMLSpanElement;
        this.npdFileName = clone.querySelector("span.ui-notepad-filename") as HTMLSpanElement;

        this.npdFileName.innerText = fileName;
        this.resolveInput = null;

        this.npdInput.addEventListener("keydown", this.tab);
        this.npdInput.value = preExistingContent;
        
        this.npdIndentSpacesSelect.querySelectorAll<HTMLDivElement>(".option").forEach(option => option.addEventListener("click", this.changeSelection));

        this.npdIndentSpacesButton.addEventListener("mouseenter", () => {
            clearTimeout(hovertimeout);
            this.npdIndentSpacesSelect.style.display = "flex";
        })
        this.npdIndentSpacesButton.addEventListener("mouseleave", this.hideWithDelay);

        this.npdIndentSpacesSelect.addEventListener("mouseover", this.deleteTimeout);
        this.npdIndentSpacesSelect.addEventListener("mouseleave", this.hideWithDelay);
        this.npdSaveCloseButton.addEventListener("click", this.submit);

    }

    private insertIntoDom = () => {
        
        // safety to prevent double insertions
        if(this.inserted == false){
            terminalLinesList.appendChild(this.npdWindow);
            this.inserted = true;
        }
    }
    private submit = () => {
        if(this.resolveInput !== null){
            this.resolveInput(this.npdInput.value);
            this.resolveInput = null;
            this.inserted = false;
            this.npdWindow.remove();
        }
    }
    
    private changeSelection = (event: Event) => {
        const target = event.target as HTMLDivElement;
        count = Number(target.getAttribute("data-value")!);
        INDENT = SPACE.repeat(count);
        this.npdIndentSpacesPreview.innerText = count.toString();
    }

    /**
     * Returns a promise which resolves to string when user clicks the "Save and Exit" button inside the notepad window.
     * The notepad is only inserted into dom when this function is called, which allows for multiple usage of the same notepad instance
     */
    public getContent=(): Promise<string> => {
        this.insertIntoDom();
        return new Promise((resolve) => {
            this.resolveInput = resolve;
        })
    }
    
    private deleteTimeout = ()  => {
        clearTimeout(hovertimeout)
    }

    private hideWithDelay = ()  => {
        hovertimeout = setTimeout(() => {
            this.npdIndentSpacesSelect.style.display = "none";
        }, TIMEOUT_DELAY) 
    }

    //event listener for tab presses since by there is no default behaviour to handle tab inputs in html textarea elements
    private tab = (event: KeyboardEvent) => {
        if (event.key === "Tab") {
            console.log("tab")
            event.preventDefault();
            const target = event.target as HTMLTextAreaElement;
            const start = target.selectionStart;
            const end = target.selectionEnd;

            target.value = target.value.substring(0, start) + INDENT + target.value.substring(end);
            target.selectionEnd = start + count;
        }
    }
}

