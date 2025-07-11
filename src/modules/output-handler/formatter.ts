import { __shell } from "../../main";

export class OutputTemplates {
    // always the final step in output pipeline
    public static userInputPreview(content: string) {
        // last command which user entered

        return `
        <li class="line">
          <div class="primary-prompt">
          <span class="username">${__shell.globals.user.username}</span>
          <span class="current-directory">${__shell.globals.fs.currentDirectory || "~\\"}</span>
            <div class="line-content">${content}</div>
            </li>
            `
    }


    // TODO: Remove use of stringify where multiline output is there
    /**
     * Takes in string or string[] to be outputted, Function auto formats output based on input hence no need to use stringify for multiline output
     */
    public static standardTerminalOutput(content: string): string;
    public static standardTerminalOutput(content: string[]): string;
    public static standardTerminalOutput(content: string | string[]): string {
        if (Array.isArray(content)) {
            const joined = content.map(line => `<div class="line-content">${line}</div>`).join("");
            return `<li class="line terminal-output multiline">${joined}</li>`;
        } else {
            return `
                <li class="line terminal-output">
                    <div class="line-content">${content}</div>
                </li>
            `;
        }
    }
    
}    

/**
 * Returns span enclosed string having provided color.
 * DONOT USE RETURN AS STRING
 */
export function addColor(content: string, color: string) {
    return `<span class="${color}">${content}</span>`;
}
export function cleanUserInput(inputString: string) {
    // TODO: add funcitonality
    return inputString.trim();
}
export function stringify(inputArray: string[]): string {
    return inputArray
        .filter(line => line.trim() !== '') // remove empty/whitespace lines
        .map(line => line.trim())          // trim each line
        .join('\n');
}