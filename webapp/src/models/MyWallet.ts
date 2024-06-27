import type { Network, JsonRpcSigner, BrowserProvider } from 'ethers'

export interface IMyWallet {
  address: string | null
  chain: Network | null
  signer: JsonRpcSigner | null
  provider: BrowserProvider | null
}
