import { extractFlagsAndOptions } from "../modules/shell/core/extract";
import { tokenize } from "../modules/shell/core/tokenizer";

// console.log(extractFlagsAndOptions(tokenize("echo hello world --color red")))
// console.log(extractFlagsAndOptions(tokenize("echo hello world --color red -b")))
// console.log(extractFlagsAndOptions(tokenize("echo hello world --color red --b")))
// console.log(extractFlagsAndOptions(tokenize("echo hello world -b -a")))
// console.log(extractFlagsAndOptions(tokenize("echo hello world -b -a -f -a -c -e -x -aas --s --color red ")))
console.log(extractFlagsAndOptions(tokenize("help --cmd ")))
