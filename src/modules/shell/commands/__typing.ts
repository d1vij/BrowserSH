import type { DirectoryNode } from "../components/__typing"

export type ParentalNodeFromPathContext = { 
    root: DirectoryNode,
    path: Array<string>
}