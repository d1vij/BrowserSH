import { embeddedSitesTemplate, terminalContentDiv, terminalLinesList } from "../dom-elements";
import { TerminalOutputHandler } from "../output-handler/terminal-output-handler";
import type { TMaybeDefined } from "../shell/core/__typing";

export class EmbedExternalWebsites {
    public url;

    private container: TMaybeDefined<HTMLDivElement>;
    constructor(url: string) {
        this.url = url;
    }
    public embed() {
        return new Promise((resolve) => {
            const clone = embeddedSitesTemplate.content.cloneNode(true) as DocumentFragment;

            this.container = clone.querySelector("div#embedded-websites-container") as HTMLDivElement;

            const siteUrl = this.container.querySelector("span#site-url") as HTMLSpanElement;
            siteUrl.innerText = this.url;
            siteUrl.addEventListener("mouseenter", () => {
                siteUrl.innerText = "Url doesnt change as per iframe's current url :))";
            })
            siteUrl.addEventListener("mouseleave", () => {
                siteUrl.innerText = this.url;
            })

            const closeButton = this.container.querySelector("button#close-button") as HTMLButtonElement;
            closeButton.addEventListener("click", () => {
                this.container?.remove();
                TerminalOutputHandler.printToTerminal("Closed External Site");
                terminalLinesList.classList.remove("hidden");
                resolve(0);
            })


            const iframe = document.createElement("iframe");
            iframe.className = "embedded-websites-frame";
            iframe.src = this.url;
            this.container.appendChild(iframe);

            terminalContentDiv.appendChild(this.container);

            // This approach might cause bugs in hiding stuff thats not in terminal lines list
            terminalLinesList.classList.add("hidden");
        })
    }
}