import { terminalInputFeild } from "./dom-elements";
import { SHELL } from "./main";
import { addColor, updatePrimaryPrompt } from "./output-handler/formatter";
import { TerminalOutputHandler } from "./output-handler/terminal-output-handler";
import { Colors } from "./output-handler/colors";
import { commandIndex } from "./shell/commands/command-index";
import { FileSystem } from "./shell/components/file-system/file-system-core";
import { pause } from "./shell/core/pause";
import { commandInputFeildHidden, sanitizeHTML } from "./shell/core/shell";
import { LoaderFactory } from "./ui/loader";
import { promptUser } from "./ui/prompt-user";

const termprint = TerminalOutputHandler.printToTerminal

const randomTime = () => Math.random() * (400 - 100) + 100;

const debug = true;


export async function startupConfig(cb: () => void) {
    commandInputFeildHidden(true);

    if (!debug) {

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
            await pause(randomTime());
        }
        termprint(`${addColor("[OK]", Colors.green_mint)} System boot completed in ${(Date.now() - startTime) / 1000} seconds`);

        const l = new LoaderFactory(addColor("Starting Shell", Colors.blue_cool), 100, "braille", Colors.red);
        const p = l.startLoading();
        // await l.startLoadingFor(3000, true);
        let username = await promptUser("Enter username ", false, true);
        username = username?.trim() === "" || username === undefined ? "guest" : username.trim();
        // eh prolly do this some other way
        if (username === "guest") termprint("No username recieved, defaulting to guest");
        
        SHELL.globals.vars.set("&&username", sanitizeHTML(username));
        SHELL.globals.vars.set("&&primary_prompt", `${username}@${detectBrowser()}`);
        updatePrimaryPrompt();

        l.stopLoading(true);
        await p;

        l.setText("Curating user profile");
        await l.startLoadingFor(2500, true);

        TerminalOutputHandler.clearTerminal();
        await pause(randomTime());
        termprint(addColor(`Welcome to BrowserSH v0.1.0`, Colors.blue_ice));
        await pause(500);
        termprint(`Type ${addColor("list commands", Colors.yellow_faded)} to see available commands.`)

        await pause(randomTime());
    }
    else {
        SHELL.globals.vars.set("&&username", "IN_DEBUG_MODE");
        SHELL.globals.vars.set("&&primary_prompt", "RAWR");
        updatePrimaryPrompt();
    }
    // const __test_dir = FileSystem.createDirectoryByPath("/temp/content", SHELL.globals.fs.root, false);
    // const __home = FileSystem.createDirectoryByPath("/home/", SHELL.globals.fs.root, false);
    // FileSystem.createFileByPath("./info.txt", __home.parent!, "Linux Bash terminal Emulated purely on browser")
    // FileSystem.createFileByPath("test.txt", __test_dir, "Hello World!");

    const home = FileSystem.createDirectory(SHELL.globals.fs.root, "home");
    FileSystem.createFileByPath("about.txt", home, content_about);

    const _var = FileSystem.createDirectory(SHELL.globals.fs.root, "var");
    const log = FileSystem.createDirectory(_var, "log");
    FileSystem.createFileByPath("boot.log", log, content_bootlog);

    const bin = FileSystem.createDirectory(SHELL.globals.fs.root, "bin");
    for (const cmd of commandIndex.keys().toArray()) {
        FileSystem.createFileByPath(cmd, bin, "Nothing to see here!!");
    }


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

// 

const content_about = `TODO`;
const content_bootlog = `TODO`;