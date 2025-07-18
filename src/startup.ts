import { __shell } from "./main";
import { updatePrimaryPrompt } from "./modules/output-handler/formatter";
import { FileSystem } from "./modules/shell/components/file-system/file-system";

export function startupConfig() {
    // initial stuff
    __shell.globals.vars.set("ping", "pong");
    __shell.globals.vars.set("&&username", `guest@${detectBrowser()}`);

    const __test_dir = FileSystem.createDirectoryByPath("/temp/content", __shell.globals.fs.root, false);
    const __home = FileSystem.createDirectoryByPath("/home/", __shell.globals.fs.root, false);
    FileSystem.createFileByPath("./info.txt", __home.parent!,"Linux Bash terminal Emulated purely on browser")
    FileSystem.createFileByPath("test.txt",__test_dir, "Hello World!");
    
    updatePrimaryPrompt();
    
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