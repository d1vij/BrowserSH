import { __shell } from "../../../../../main";
import { addColor } from "../../../../output-handler/formatter";
import { TerminalOutputHandler } from "../../../../output-handler/terminal-output-handler";
import { Colors } from "../../../../output-handler/typing/enums";
import { promptUser } from "../../../../ui/prompt-user";

export async function setup(){
    TerminalOutputHandler.printToTerminal("todo")
    TerminalOutputHandler.printToTerminal("Hello! This is a browser emulated web terminal !")
    const username = await promptUser("Setup a username : ") || "sys";
    TerminalOutputHandler.printToTerminal(`Setup a username : ${username}`);
    __shell.globals.vars.set("&&username", username);
    TerminalOutputHandler.printToTerminal(`Hello ${addColor(username, Colors.yellow_light)} !!`);
    const anot = await promptUser("Another user input cuz why not ???????? -> ") || "YOU DIDINT PROVIDE A INPUT 😡😡😡"
    TerminalOutputHandler.printToTerminal(anot);
    return;
}