# BrowserSH

A zero-dependency, object-oriented Linux-style shell and terminal emulator that runs entirely in the browser. Built with TypeScript, SCSS, HTML and bundled using Vite, BrowserSH emulates a full command-line experience without any backend required.

> This project is a very early Work in Progress Prototype. Along with Basic commands, it is possible to embed other programs to emulate "applications" (for example, the notepad is a standalone application embedded with some modifications)

## Features

### Modular Architecture

All modules adhere to the _Unix philosophy_ of "doing one thing and doing it well". This enables independent development and testing of components without side effects, promoting code reusability and maintainability. Moreover BrowserSH employs design patterns like Factories, Singletons, Abstracted as :

- **Singletons** for global state management and shell instance coordination
- **Factory pattern** for command instantiation, allowing dynamic creation of command objects without exposing creation logic
- **Modular pipelines** for tokenizing, parsing, execution, and outputting that work together seamlessly

### Easy Development of New Commands
BrowserSH provides a streamlined approach to extending functionality through its **AbstractCommand** class. New commands can be easily added by:

1. **Extending AbstractCommand.ts**: All commands inherit from this base class, which provides a fixed and predictable structure
2. **Implementing required methods**: The abstract class defines the interface that all commands must follow

The AbstractCommand pattern provides abstraction common functionality like argument parsing, error handling, and execution context management, while allowing specific command implementations to focus solely on their unique behavior.

<!-- ### Self-Documented Code
Every component, class, and major function includes comprehensive inline documentation following TypeScript's JSDoc standards[2][3]. This documentation approach serves multiple purposes:

- **Immediate context** for developers working with the code
- **IDE integration** enabling hover tooltips and autocomplete assistance
- **Living documentation** that evolves with the codebase
- **Clear explanations** of not just what each element does, but why it exists and how it fits into the broader system architecture

Method signatures include parameter descriptions, return value explanations, and usage examples where appropriate, making the codebase accessible to both contributors and user. -->

### Virtual File System
BrowserSH implements a in-memory directory tree that supports standard file system operations. The virtual file system provides:

- **Standard operations** like `cd`, `ls`, `touch`, `mkdir`, `rm`, and file editing capabilities using inbuilt notepad program
- **Hierarchical structure**: Files and directories organized in a tree-like structure and are 
- **Session-scoped persistence**: File system state is maintained throughout the browser session until page refreshes

### Shell Variable System
BrowserSH also implements a in memory,session persisted,  Variable System using hashmaps which other helper functions which allows to

- **Create variables** using unescaped dollar sign (`$`) syntax
```
$count = 10
```
- **Substitute variables** in commands using `$name` syntax
```bash
$fruit = apple
$count = 10
echo 'I Bought' $count count of "$fruit" # yes, commands do support quotations
```


## Using the Shell

BrowserSH mimics BASH-style commands, making it intuitive for users familiar with traditional Unix terminals.

- Enter `list commands` to view all available commands
- Use `help <command name>` to get detailed usage information for specific commands

<hr>

