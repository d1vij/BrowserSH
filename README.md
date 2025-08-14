# About
BrowserSH is a zero-dependency, browser-based Linux-style shell built with TypeScript, SCSS, HTML, and Vite. It’s a WIP prototype that emulates a command-line entirely in the browser without any backend.

Key Features:

Modular Architecture: Uses Unix-style modularity with design patterns (Singletons for state, Factory for command creation, modular pipelines for tokenizing/parsing/execution).

Easy Command Development: New commands extend AbstractCommand, inheriting built-in argument parsing, error handling, and execution context, while implementing only unique behavior.

Virtual File System: In-memory, session-persisted directory tree supporting cd, ls, touch, mkdir, rm, and in-browser file editing.

Shell Variable System: In-memory, session-persisted variables with $var creation/substitution and support for quotations.

Usage:

list commands → show all commands

help <command> → detailed usage inf


-


## Using the Shell

BrowserSH mimics BASH-style commands, making it intuitive for users familiar with traditional Unix terminals.

- Enter `list commands` to view all available commands
- Use `help <command name>` to get detailed usage information for specific commands

 **Create variables** using unescaped dollar sign (`$`) syntax
```
$count = 10
```
- **Substitute variables** in commands using `$name` syntax
```bash
$fruit = apple
$count = 10
echo 'I Bought' $count count of "$fruit" # commands support quotations too
```
<hr>

