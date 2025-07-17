import { primaryPromptCurrentDirectory, primaryPromptUsername } from "../../dom-elements";
import { __shell } from "../../main";
import { FileSystem } from "../shell/components/file-system/file-system";

/**
 * Static clsas providing formatting to data to be outputed to the frontend terminal
 */
export class OutputTemplates {
    /**
     * preview of user entered command
     */
    public static userInputPreview(command: string) {

        return `
        <li class="line">
          <div class="primary-prompt">
                <span class="username">${__shell.globals.vars.get("&&username")}</span>
                <span class="current-directory">${FileSystem.getPathFromNode(__shell.globals.fs.currentDirectoryNode)}</span>
          </div>
          <div class="line-content">${command}</div>
        </li>
            `
    }


    /**
     * Formats the output given by the shell
     * Takes in string for singleline or string[] for multiline output
     */
    public static standardTerminalOutput(content: string): string;
    public static standardTerminalOutput(content: string[]): string;
    public static standardTerminalOutput(content: string | string[]): string;

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
 * Updates the primary prompt after each command cycle. Primary prompt contains the username and current directory.
 */
export function updatePrimaryPrompt() {
    primaryPromptUsername.innerText = __shell.globals.vars.get("&&username") || "USERNAME_NOT_SET";
    primaryPromptCurrentDirectory.innerText = FileSystem.getPathFromNode(__shell.globals.fs.currentDirectoryNode);
}

/**
 * Returns span enclosed string having provided color.
 * Returned content not to be used in anything aside from terminal outputting
 */
export function addColor(content: string, color: string): string;
export function addColor(content: Array<string>, color: string): string[]
export function addColor(content: Array<string> | string, color: string): string | string[] {
    if (Array.isArray(content)) return content.map(line => `<span class="${color}">${line}</span>`);
    else return `<span class="${color}">${content}</span>`;
}
