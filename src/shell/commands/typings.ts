import type { DirectoryNode } from "../components/__typing"

export type PathContext = { 

    root: DirectoryNode,
    path: Array<string>
}

export type MaybeAsyncFunction<T> = () => T | Promise<T>;