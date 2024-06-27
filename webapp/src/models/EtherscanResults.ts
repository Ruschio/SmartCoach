export interface IMultipleSources {
  language: string
  sources: {
    [contractName: string]: {
      content: string
    }
  }
  settings?: {
    remappings?: Array<string>
    optimizer?: Object
    metadata?: Object
    outputSelection?: Object
    evmVersion?: string
    viaIR?: boolean
    libraries?: Object
  }
}

export interface ISourceCode {
  SourceCode: string
  ABI: string
  ContractName: string
  CompilerVersion: string
  OptimizationUsed: string
  Runs: string
  ConstructorArguments: string
  EVMVersion: string
  Library: string
  LicenseType: string
  Proxy: string
  Implementation: string
  SwarmSource: string
}
