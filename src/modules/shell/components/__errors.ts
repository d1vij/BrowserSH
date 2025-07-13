// file system
export class NodeIsFileError extends Error {
    constructor(message: string = "Node is a file") {
        super(`NodeIsFileError: ${message}`);
        this.name = 'NodeIsFileError';
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
export class NodeIsDirectoryError extends Error {
    constructor(message: string = "Node is a directory") {
        super(`NodeIsDirectoryError: Node exits with name ${message} in directory.`);
        this.name = 'NodeIsDirectoryError';
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
export class NodeWithSameNameExistsError extends Error {
    constructor(message: string) {
        super(`NodeWithSameNameExistsError: ${message}`);
        this.name = 'NodeWithSameNameExistsError';
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