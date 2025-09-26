import { CommandHistory } from "./command-history";
import { FileSystem } from "./file-system/file-system";
import { StorageSystem } from "./storage-system";
import { VariableSystem } from "./variables-system";

/**
 * GlobalsFactory instantiates a "Globals" object which acts as a pseudo environment for the shell / terminal.
 * All other similar environment factories are also instantiated here, making this class's instance a singleton for all the other components
 */
export class GlobalsFactory {
    public fs: FileSystem;
    public vars: VariableSystem;
    public storage: StorageSystem;
    public commandHistory: CommandHistory;

    constructor() {

        // initial root directory is empty and its name is '#' (not bash like rawrrr)
        this.fs = new FileSystem({
            initialStructure: {
                name: "@",
                type: "directory",
                parent: null,
                children: [],
            }
        });

        this.vars = new VariableSystem();
        this.storage = new StorageSystem();
        this.commandHistory = new CommandHistory();
    }
}