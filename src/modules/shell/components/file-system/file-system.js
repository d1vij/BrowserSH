"use strict";
// core file system logic, implemented using nested linked lists orabstract data tree
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSystem = void 0;
var errors_1 = require("./errors");
function nodeNamesFrom(path) {
    return path.split("/").filter(Boolean); //only have non empty node names
}
var FileSystem = /** @class */ (function () {
    function FileSystem() {
    }
    // NON-INSTANTIABLE
    /**
     * Creates and appends a new DirectoryNode Object in parent's child nodes. Returns reference object to the created object
     * Throws error if node with same name (case sensistive) exists in current directory, pass overwrite=true to enable forced overwriting
     */
    FileSystem.createDirectory = function (parent, name, overwrite) {
        if (overwrite === void 0) { overwrite = false; }
        if (parent.type == "file")
            throw new errors_1.NodeIsFileError("".concat(parent.name, " is a file"));
        var nodeExists = parent.children.some(function (node) { return node.name === name; });
        if (nodeExists && overwrite == false)
            throw new errors_1.NodeWithSameNameExistsError(name);
        var _dir = {
            name: name,
            parent: parent,
            type: "directory",
            children: []
        };
        parent.children.push(_dir);
        return _dir;
    };
    /**
     * Creates nested directories based on given path and parent
     */
    FileSystem.createDirectoryByPath = function (path, parent, overwrite) {
        if (overwrite === void 0) { overwrite = false; }
        var directoryNames = path.split("/").filter(Boolean);
        console.log(directoryNames);
        // checking if any of node from provided path exists ??
        // let curr = parent.children.find(node => (node.name == directoryNames[0] && node.type == "directory")) as DirectoryNode | undefined
        // for(const name in directoryNames){
        //     if(curr === undefined) break;
        //     curr = curr?.children.find(node => node.name == name && node.type == "directory") as DirectoryNode;
        // }
        var pre = parent;
        for (var _i = 0, directoryNames_1 = directoryNames; _i < directoryNames_1.length; _i++) {
            var name_1 = directoryNames_1[_i];
            // TODO: add error handling
            pre = this.createDirectory(pre, name_1);
        }
        return pre;
    };
    /**
     * Creates and appends a new FileNode Object in parent's child nodes. Returns reference object to the created object
     * Throws error if node with same name (case sensistive) exists in current directory, pass overwrite=true to enable forced overwriting
     */
    FileSystem.createFile = function (parent, name, content, overwrite) {
        if (content === void 0) { content = ""; }
        if (overwrite === void 0) { overwrite = false; }
        if (parent.type == "file")
            throw new errors_1.NodeIsFileError("".concat(parent.name, " is a file"));
        var nodeExists = parent.children.some(function (node) { return node.name === name; });
        if (nodeExists && overwrite == false)
            throw new errors_1.NodeWithSameNameExistsError(name);
        var _file = {
            name: name,
            parent: parent,
            content: content,
            type: "file"
        };
        parent.children.push(_file);
        return _file;
    };
    /**
     * Traverses and returns indent-formatted tree-like string of all nodes within a root node
     */
    FileSystem.traverseAndList = function (root, maxDepth, __depth, __output) {
        if (maxDepth === void 0) { maxDepth = Infinity; }
        if (__depth === void 0) { __depth = 0; }
        if (__output === void 0) { __output = ""; }
        // TODO: add output format ? string or array
        return root.name + __traverse(root, maxDepth, __depth, __output);
    };
    FileSystem.getNodeByPath = function (path, root) {
        var nodeNames = nodeNamesFrom(path);
        return __getNodeByPath(nodeNames, root);
    };
    FileSystem.getPathFromNode = function (node, endNode) {
        var __path = [];
        var curr = node;
        while (curr != null || curr.name != endNode) {
            __path.push(curr.name);
            curr = curr.parent;
        }
        return __path
            .reverse()
            .join("/");
    };
    return FileSystem;
}());
exports.FileSystem = FileSystem;
function __traverse(root, maxDepth, __depth, __output) {
    if (__depth === void 0) { __depth = 0; }
    if (__output === void 0) { __output = ""; }
    // checking if current depth doesnt exceed maximum depth
    if (__depth > maxDepth)
        return __output;
    if (root.type === "file")
        throw new errors_1.NodeIsDirectoryError("".concat(root.name, " is a file"));
    var indent = '\n ' + "|  ".repeat(__depth) + '|-- ';
    for (var _i = 0, _a = root.children; _i < _a.length; _i++) {
        var node = _a[_i];
        if (node.type === "directory") {
            __output += indent + node.name;
            __output = __traverse(node, maxDepth, __depth + 1, __output);
        }
        else {
            __output += indent + node.name;
        }
    }
    return __output;
}
function __getNodeByPath(nodeNames, root) {
    var current = root;
    var _loop_1 = function (part) {
        if (current.type === "file")
            undefined;
        var next = current.children.find(function (node) { return node.name === part; }); //is case sensitive
        if (!next)
            return { value: undefined };
        // @ts-ignore
        // FIXME: collision bw fsnode and direcotoryNode types
        current = next;
    };
    for (var _i = 0, nodeNames_1 = nodeNames; _i < nodeNames_1.length; _i++) {
        var part = nodeNames_1[_i];
        var state_1 = _loop_1(part);
        if (typeof state_1 === "object")
            return state_1.value;
    }
    return current;
}
