// file system
export class NodeIsFileError extends Error {
    public path: string;
    constructor(path: string = "Node is a file") {
        super(`NodeIsFileError: ${path}`);
        this.path = path;
        this.name = 'NodeIsFileError';
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
export class NodeIsDirectoryError extends Error {
    public path;
    constructor(path = "Node is a directory") {
        super(`NodeIsDirectoryError: Node exits with name ${path} in directory.`);
        this.path = path;
        this.name = 'NodeIsDirectoryError';
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
export class NodeWithSameNameExistsError extends Error {
    public path: string;
    constructor(path: string) {
        super(`NodeWithSameNameExistsError: ${name}`);
        this.name = 'NodeWithSameNameExistsError';
        this.path = path;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
export class NodeToRemoveIsADirectoryAndNoRecurseFlagIsProvidedError extends Error {
    public path: string;
    constructor(path: string) {
        super(`NodeToRemoveIsADirectoryAndNoRecurseFlagIsProvidedError: ${ path }`);
        this.path = path;
        this.name = 'NodeToRemoveIsADirectoryAndNoRecurseFlagIsProvidedError';
        Object.setPrototypeOf(this, new.target.prototype);
    }
}


// variables factory
export class VariableDoesNotExistsError extends Error {
    public varName: string;
    constructor(message: string, varName:string) {
        super(`VariableDoesNotExistsError: ${message}`);
        this.name = 'VariableDoesNotExistsError';
        this.varName = varName;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}