import {deepStrictEqual} from "assert";
import {FileSystem} from "../modules/shell/components/file-system/file-system";
import { FileSystemFactory } from "../modules/shell/components/file-system/file-system-factory";
import type { DirectoryNode, FileNode } from "../modules/shell/components/__typing";

const root = {
    type: "directory",
    name: "/",
    parent: null,
    children: []
} as DirectoryNode

const __fs = new FileSystemFactory({
    initialStructure: root,
    initialDirectory: "/"
})
    
function test(description, fn) {
    try {
        fn();
        console.log(`✅ ${description}`);
    } catch (err) {
        console.error(`❌ ${description}`);
        console.error(err.message);
    }
}

const content = FileSystem.createDirectory(root, "content");
const data_txt = FileSystem.createFile(content, "data.txt", "Hello World!")

test("Getting valid node by path", ()=>{
    deepStrictEqual(FileSystem.getNodeByPath("/content/data.txt", root), data_txt)
})
test("Getting invalid valid node by path", ()=>{
    deepStrictEqual(FileSystem.getNodeByPath("/invalid/content/data/this/that/data.txt", root), undefined)
})
test("File content reading", ()=>{
    const file = FileSystem.getNodeByPath("/content/data.txt", root) as FileNode
    deepStrictEqual(file.content, "Hello World!")
})
const __dir = FileSystem.createDirectoryByPath("this/dir/should/get/created", root);
FileSystem.createFile(__dir, "haha.txt", "shuhs");
console.log(FileSystem.traverseAndList(root))
console.log((FileSystem.getNodeByPath("/this/dir/should/get/created/haha.txt", root) as FileNode).content);

FileSystem.createDirectoryByPath("/not/get/created", __dir.parent!);
FileSystem.createDirectoryByPath("/sibling/to/should", __dir.parent!.parent!.parent!);
console.log(FileSystem.traverseAndList(root))
console.log(FileSystem.getPathFromNode(__dir));
console.log((FileSystem.getNodeByPath("/", root)))

// test("Creating directory node", ()=>{

// 
// })