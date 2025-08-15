import { loaderTemplate, terminalLinesList } from "../../dom-elements";


/**
 * A simple ascii based loader
 * 
 * Usage
 * 1. Instantiate a loader instace
 *    l = new LoaderFactory(100, "Fetching Url", "braille", Colors.red)
 * 2. Start the loader
 *    l.startLoading()
 * 3. Stop loading when required
 *    l.stopLoading()
 */
export class LoaderFactory {
    private loaderStates: Array<string>;
    private loaderStatesLength;

    private delay: number;
    private loader: HTMLSpanElement;
    private loaderText: HTMLSpanElement;
    private loaderContainer: HTMLSpanElement;

    private isSpinning = false;
    private currIdx = 0;
    private color: string = "";

    constructor(
        msDelay: number = 100, // lower the delay, faster would the state of spinner change
        text: string,
        loaderType: "line" | "braille" | "circle",
        color: string
    ) {

        this.delay = msDelay;


        switch (loaderType) {
            case "line": this.loaderStates = ['|', '/', '-', '\\']; break;
            case "circle": this.loaderStates = ['◜', '◝', '◞', '◟', '◜', '◝', '◞', '◟']; break;
            case "braille": this.loaderStates = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']; break;
        }

        this.loaderStatesLength = this.loaderStates.length;
        const clone = loaderTemplate.content.cloneNode(true) as DocumentFragment;
        this.loader = clone.querySelector("span.loader") as HTMLSpanElement;
        this.loaderContainer = clone.querySelector("span.loader-container") as HTMLSpanElement;
        this.loaderText = clone.querySelector("span.loader-text") as HTMLSpanElement;

        this.setColor(color);
        this.setText(text);
    }
    public setText(text: string) {
        this.loaderText.innerText = text;
    }
    public setColor(color: string) {
        // Takes in colors from the Colors enum
        // Coloring like this is possible because of highlighting done in hightlights.scss
        if (this.color !== '') this.loader.classList.remove(this.color);
        this.loader.classList.add(color);
    }
    public startLoading() {
        this.isSpinning = true;

        terminalLinesList.appendChild(this.loaderContainer)

        return new Promise(resolve => {
            if (!this.isSpinning) resolve(0);
            setInterval(() => {
                this.loader.innerText = this.loaderStates[this.currIdx];
                if (this.currIdx >= this.loaderStatesLength - 1) this.currIdx = 0
                else this.currIdx++;
            }, this.delay)
        })
    }
    public stopLoading(maintainState = false) {
        // if maintain state is true, loader and text will be retained in the Terminal Output

        if (!maintainState) {
            this.loaderContainer.remove();
        }
        this.isSpinning = false;
    }
}
