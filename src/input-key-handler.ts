// Handles the key inputs coming from terminal

import { terminalInputDiv } from "./dom-elements";
import { SHELL } from "./main";
import { OutputTemplates } from "./output-handler/formatter";
import { TerminalOutputHandler } from "./output-handler/terminal-output-handler";
import { UserInputHandler } from "./output-handler/user-input-handler";

// Handles the key inputs coming from terminal

export enum Key {
    Backspace = "Backspace",
    Tab = "Tab",
    Enter = "Enter",
    Shift = "Shift",
    Ctrl = "Control",
    Alt = "Alt",
    PauseBreak = "Pause",
    CapsLock = "CapsLock",
    Escape = "Escape",
    Space = " ",
    PageUp = "PageUp",
    PageDown = "PageDown",
    End = "End",
    Home = "Home",

    LeftArrow = "ArrowLeft",
    UpArrow = "ArrowUp",
    RightArrow = "ArrowRight",
    DownArrow = "ArrowDown",

    Insert = "Insert",
    Delete = "Delete",

    Zero = "0",
    One = "1",
    Two = "2",
    Three = "3",
    Four = "4",
    Five = "5",
    Six = "6",
    Seven = "7",
    Eight = "8",
    Nine = "9",

    A = "a",
    B = "b",
    C = "c",
    D = "d",
    E = "e",
    F = "f",
    G = "g",
    H = "h",
    I = "i",
    J = "j",
    K = "k",
    L = "l",
    M = "m",
    N = "n",
    O = "o",
    P = "p",
    Q = "q",
    R = "r",
    S = "s",
    T = "t",
    U = "u",
    V = "v",
    W = "w",
    X = "x",
    Y = "y",
    Z = "z",

    F1 = "F1",
    F2 = "F2",
    F3 = "F3",
    F4 = "F4",
    F5 = "F5",
    F6 = "F6",
    F7 = "F7",
    F8 = "F8",
    F9 = "F9",
    F10 = "F10",
    F11 = "F11",
    F12 = "F12",

    SemiColon = ";",
    Equals = "=",
    Comma = ",",
    Dash = "-",
    Period = ".",
    ForwardSlash = "/",
    Tilde = "`",
    OpenBracket = "[",
    ClosedBracket = "]",
    Quote = "'"
}


export function handleInput(event: KeyboardEvent) {
    if (event.key == Key.Enter) {
        event.preventDefault();
        SHELL.process();
        return;
    } else if (event.key == Key.C && event.ctrlKey == true) {
        const userSelection = window.getSelection()?.toString() || "";

        // Dont interrupt command if user has selected text
        if (userSelection !== "") return;
        
        event.preventDefault();
        TerminalOutputHandler.printToTerminal(OutputTemplates.userInputPreview(UserInputHandler.getUserInput() + "^C"), true);
        UserInputHandler.clearUserInput();
    } else if (event.key == Key.UpArrow){
        event.preventDefault();
        UserInputHandler.setUserInput(SHELL.globals.commandHistory.getPrevious());
    } else if (event.key == Key.DownArrow){
        event.preventDefault();
        UserInputHandler.setUserInput(SHELL.globals.commandHistory.getNext());
    }
}