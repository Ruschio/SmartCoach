export interface IFlattenRequest {
    contractName: string
    code: {
        [path: string]: string
    }
    remappings?: Array<string>
}

export interface IFlattenResults {
    contractName: string
    code: string
}