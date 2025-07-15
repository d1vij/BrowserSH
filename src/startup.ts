import { __shell } from "./main";
import { updatePrimaryPrompt } from "./modules/output-handler/formatter";
import { FileSystem } from "./modules/shell/components/file-system/file-system";

export function startupConfig() {
    // initial stuff
    __shell.globals.vars.set("ping", "pong");
    __shell.globals.vars.set("&&username", "divij");

    const __test_dir = FileSystem.createDirectoryByPath("/temp/content", __shell.globals.fs.root, false);
    const __home = FileSystem.createDirectoryByPath("/home/", __shell.globals.fs.root, false);
    FileSystem.createFile(__home, "info.txt", "Linux Bash terminal Emulated purely on browser")
    FileSystem.createFile(__test_dir, "test.txt", "Hello World!");
    
    updatePrimaryPrompt();
    
}