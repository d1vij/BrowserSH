"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSystemFactory = void 0;
/**
 * Factory class to generate a FileSystem Object, which stores "file system" and other attributes. This is publicly exposed class to store fs data
 */
var FileSystemFactory = /** @class */ (function () {
    function FileSystemFactory(config) {
        this.filesystem = config.initialStructure;
        this.currentDirectory = config.initialDirectory || "/";
    }
    return FileSystemFactory;
}());
exports.FileSystemFactory = FileSystemFactory;
