export interface ICompileRequest {
    code: string
}

export interface ICompileResults {
    abi: Object
    bytecode: string
    code: string
    solidity: string
}