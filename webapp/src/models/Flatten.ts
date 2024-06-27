export interface IFlattenRequest {
  contractName: string
  code: {
    [path: string]: string
  }
}

export interface IFlattenResults {
  contractName: string
  code: string
}
