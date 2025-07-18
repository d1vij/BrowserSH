# BrowserSH

A zero-dependency, object-oriented Linux-style shell and terminal emulator that runs entirely in the browser. Built with TypeScript, SASS, Vite, and plain HTML/CSS, BrowserSH delivers a full command-line experience—no backend required.
Features

Virtual File System
In-memory directory tree supporting standard operations: cd, ls, touch, mkdir, rm, file editing, and session-scoped persistence.

Shell Variable System
Create and substitute variables using $name syntax for simple scripting.

Command History & Completion
Real-time command execution with history navigation and tab completion.

Modular Architecture
– Singletons for global state and dispatcher
– Factory for command instantiation
– Command pattern to encapsulate each operation
– Pipelines for tokenizing, parsing, execution, and rendering

Unix Philosophy
Each module “does one thing and does it well,” enabling independent development and testing without side effects.

Self-Documenting Code
Comprehensive JSDoc comments on every class, method, and function provide clear context and tooling support.

Extensible Commands
Base on AbstractCommand.ts: extend the abstract class, implement execute(), and your command is auto-registered with built-in parsing, error handling, and help support.

Vite-Powered Build
Instant server start, hot module replacement, TypeScript and SASS compilation, plus optimized production bundles.

How to Add a Command

Create MyCommand.ts extending AbstractCommand:

ts
import AbstractCommand from '../core/AbstractCommand';

export default class MyCommand extends AbstractCommand {
name = 'mycmd';
execute(argv, io, state) {
io.out.write('Hello from mycmd');
}
}

Place the file in src/commands/—it’s auto-discovered.

Rebuild (npm run build) and enjoy your new command!

BrowserSH demonstrates that a powerful, maintainable shell can live entirely in the browser, leveraging modern web tooling and classical design principles.