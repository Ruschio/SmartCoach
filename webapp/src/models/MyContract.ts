export interface IContractSource {
  [path: string]: string
}

export interface IMyContract {
  address: string
  network: string
  abi?: string
  code?: string
  source?: IContractSource
  loading?: boolean
  name?: string
  getId: Function
}

export class MyContract implements IMyContract {
  address: string
  network: string
  abi?: string
  code?: string
  source?: IContractSource
  loading?: boolean
  name?: string

  constructor(address: string, network: string) {
    this.address = address
    this.network = network
  }

  getId(): string {
    return this.address + '@' + this.network
  }
}
