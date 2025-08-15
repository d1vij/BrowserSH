import { terminalInputFeild } from "./dom-elements";
import { SHELL } from "./main";
import { addColor, updatePrimaryPrompt } from "./modules/output-handler/formatter";
import { TerminalOutputHandler } from "./modules/output-handler/terminal-output-handler";
import { Colors } from "./modules/output-handler/typing/enums";
import { FileSystem } from "./modules/shell/components/file-system/file-system";
import { pause } from "./modules/shell/core/pause";
import { commandInputFeildHidden } from "./modules/shell/core/shell";
import { LoaderFactory } from "./modules/ui/loader";
import { promptUser } from "./modules/ui/prompt-user";

const termprint = TerminalOutputHandler.printToTerminal


export async function startupConfig(cb: () => void) {
    commandInputFeildHidden(true);

    await pause(1000);
    const startTime = Date.now();

    // boot seq
    const bootText = addColor("[BOOT]", Colors.red_muted);
    const infoText = addColor("[INFO]", Colors.yellow_faded);
    const lines = [
        infoText + " Initializing BrowserSH runtime...",
        bootText + " Loading shell modules... done",
        bootText + " Preparing virtual filesystem... OK",
        bootText + " Checking local storage quota... 512MB available",
        bootText + " Loading theme and UI components... done",
        bootText + " Initializing input/output handlers...",
        "\t> Keyboard event listener attached",
        "\t> Clipboard integration enabled",
        "\t> Display renderer ready",
        bootText + " Setting up command registry... done",
        bootText + " Establishing pseudo-network interface... OK",
        bootText + " Mounting virtual directories...",
        bootText + " Loading environment variables... done",
        bootText + " Warming up JavaScript engine... done",
        bootText + " The cake is a lie...",
        bootText + " Compiling shell scripts... done",
        bootText + " Printing obviously fake boot sequence :)...",
        bootText + " Running startup hooks... done",
        bootText + " Cleaning temporary buffers... done",
        infoText + " All systems nominal. Welcome to BrowserSH.",
    ];
    
    for (const line of lines) {
        termprint(line);
        await pause(Math.random() * (400 - 100) + 100);
    }
    termprint(`${addColor("[OK]", Colors.green_mint)} System boot completed in ${(Date.now() - startTime) / 1000} seconds`);

    const l = new LoaderFactory(addColor("Starting Shell", Colors.blue_cool), 100, "braille", Colors.red);
    const p = l.startLoading();
    // await l.startLoadingFor(3000, true);
    const username = await promptUser("Enter username ", false, true) || "guest";

    // eh prolly do this some other way
    if (username === "guest") termprint("No username recieved, defaulting to guest");
    SHELL.globals.vars.set("&&username", `${username}@${detectBrowser()}`);
    updatePrimaryPrompt();
    termprint(addColor(`Welcome to BrowserSH v0.1.0`, Colors.blue_ice));
    termprint(`Type ${addColor("list commands", Colors.yellow_faded)} to see available commands.`)

    l.stopLoading(true);
    await p;
    
    
    SHELL.globals.vars.set("ping", "pong");
    const __test_dir = FileSystem.createDirectoryByPath("/temp/content", SHELL.globals.fs.root, false);
    const __home = FileSystem.createDirectoryByPath("/home/", SHELL.globals.fs.root, false);
    FileSystem.createFileByPath("./info.txt", __home.parent!, "Linux Bash terminal Emulated purely on browser")
    FileSystem.createFileByPath("test.txt", __test_dir, "Hello World!");



    commandInputFeildHidden(false);
    terminalInputFeild.focus();
    cb();
}

// https://prathapreddy-mudium.medium.com/how-to-detect-a-clients-browser-name-using-javascript-fd0cab66f9ab
function detectBrowser() {
    var userAgent = navigator.userAgent;
    if (userAgent.indexOf("Edg") > -1) {
        return "MicrosoftEdge";
    } else if (userAgent.indexOf("Chrome") > -1) {
        return "Chrome";
    } else if (userAgent.indexOf("Firefox") > -1) {
        return "Firefox";
    } else if (userAgent.indexOf("Safari") > -1) {
        return "Safari";
    } else if (userAgent.indexOf("Opera") > -1) {
        return "Opera";
    } else if (userAgent.indexOf("Trident") > -1 || userAgent.indexOf("MSIE") > -1) {
        return "InternetExplorer";
    }

    return "UnknownBrowser";
}