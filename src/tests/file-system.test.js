"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert_1 = require("assert");
var file_system_1 = require("../modules/shell/components/file-system/file-system");
var file_system_factory_1 = require("../modules/shell/components/file-system/file-system-factory");
var root = {
    type: "directory",
    name: "/",
    parent: null,
    children: []
};
var __fs = new file_system_factory_1.FileSystemFactory({
    initialStructure: root,
    initialDirectory: "/"
});
function test(description, fn) {
    try {
        fn();
        console.log("\u2705 ".concat(description));
    }
    catch (err) {
        console.error("\u274C ".concat(description));
        console.error(err.message);
    }
}
var content = file_system_1.FileSystem.createDirectory(root, "content");
var data_txt = file_system_1.FileSystem.createFile(content, "data.txt", "Hello World!");
test("Getting valid node by path", function () {
    (0, assert_1.deepStrictEqual)(file_system_1.FileSystem.getNodeByPath("/content/data.txt", root), data_txt);
});
test("Getting invalid valid node by path", function () {
    (0, assert_1.deepStrictEqual)(file_system_1.FileSystem.getNodeByPath("/invalid/content/data/this/that/data.txt", root), undefined);
});
test("File content reading", function () {
    var file = file_system_1.FileSystem.getNodeByPath("/content/data.txt", root);
    (0, assert_1.deepStrictEqual)(file.content, "Hello World!");
});
var __dir = file_system_1.FileSystem.createDirectoryByPath("this/dir/should/get/created", root);
file_system_1.FileSystem.createFile(__dir, "haha.txt", "shuhs");
console.log(file_system_1.FileSystem.traverseAndList(root));
console.log(file_system_1.FileSystem.getNodeByPath("/this/dir/should/get/created/haha.txt", root).content);
file_system_1.FileSystem.createDirectoryByPath("/not/get/created", __dir.parent);
file_system_1.FileSystem.createDirectoryByPath("/sibling/to/should", __dir.parent.parent.parent);
console.log(file_system_1.FileSystem.traverseAndList(root));
console.log(file_system_1.FileSystem.getPathFromNode(__dir));
// test("Creating directory node", ()=>{
// 
// })
