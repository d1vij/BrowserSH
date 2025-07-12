"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var extract_1 = require("../modules/shell/core/extract");
var tokenizer_1 = require("../modules/shell/core/tokenizer");
console.log((0, extract_1.extractFlagsAndOptions)((0, tokenizer_1.tokenize)("echo hello world --color red")));
console.log((0, extract_1.extractFlagsAndOptions)((0, tokenizer_1.tokenize)("echo hello world --color red -b")));
console.log((0, extract_1.extractFlagsAndOptions)((0, tokenizer_1.tokenize)("echo hello world --color red --b")));
console.log((0, extract_1.extractFlagsAndOptions)((0, tokenizer_1.tokenize)("echo hello world -b -a")));
console.log((0, extract_1.extractFlagsAndOptions)((0, tokenizer_1.tokenize)("echo hello world -b -a -f -a -c -e -x -aas --s --color red ")));
