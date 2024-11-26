import {
  EtherscanProvider,
  type Networkish,
  type BlockTag,
  assertArgument,
  EtherscanPlugin,
  Network
} from 'ethers' //^v6
import type { ISourceCode } from './EtherscanResults'
import type { IMyNetworkInfo } from './MyNetworkInfo'
import type { IMyTransaction } from './MyTransaction'
import { MyContract } from './MyContract'

export const supportedNetworks: Map<string, IMyNetworkInfo> = new Map([
  [
    'mainnet',
    { 
      name: 'mainnet',
      desc: 'Ethereum',
      chainId: 1,
      baseUrl: 'https://api.etherscan.io',
      apiKey: 'NNU1E8B594DZJCIJG6RAVNM4WBGZYMYKNW'
    }
  ],
  [
    'goerli',
    {
      name: 'goerli',
      desc: 'Goerli Testnet',
      chainId: 5,
      baseUrl: 'https://api-goerli.etherscan.io'
    }
  ],
  [
    'sepolia',
    {
      name: 'sepolia',
      desc: 'Sepolia Testnet',
      chainId: 11155111,
      baseUrl: 'https://api-sepolia.etherscan.io',
      apiKey: 'NNU1E8B594DZJCIJG6RAVNM4WBGZYMYKNW'
    }
  ],
  [
    'holesky',
    {
      name: 'holesky',
      desc: 'Holesky Testnet',
      chainId: 17000,
      baseUrl: 'https://api-holesky.etherscan.io',
      apiKey: 'NNU1E8B594DZJCIJG6RAVNM4WBGZYMYKNW'
    }
  ],
  [
    'arbitrum',
    { name: 'arbitrum', desc: 'Arbitrum', chainId: 42161, baseUrl: 'https://api.arbiscan.io' }
  ],
  [
    'arbitrum-nova',
    {
      name: 'arbitrum-nova',
      desc: 'Arbitrum Nova',
      chainId: 42170,
      baseUrl: 'https://api-nova.arbiscan.io'
    }
  ],
  [
    'arbitrum-goerli',
    {
      name: 'arbitrum-goerli',
      desc: 'Arbitrum Goerli Testnet',
      chainId: 421613,
      baseUrl: 'https://api-goerli.arbiscan.io'
    }
  ],
  [
    'arbitrum-sepolia',
    {
      name: 'arbitrum-sepolia',
      desc: 'Arbitrum Sepolia Testnet',
      chainId: 421614,
      baseUrl: 'https://api-sepolia.arbiscan.io'
    }
  ],
  ['base', { name: 'base', desc: 'Base', chainId: 8453, baseUrl: 'https://api.basescan.org' }],
  [
    'base-goerli',
    {
      name: 'base-goerli',
      desc: 'Base Goerli Testnet',
      chainId: 84531,
      baseUrl: 'https://api-goerli.basescan.org'
    }
  ],
  [
    'base-sepolia',
    {
      name: 'base-sepolia',
      desc: 'Base Sepolia Testnet',
      chainId: 84532,
      baseUrl: 'https://api-sepolia.basescan.org'
    }
  ],
  ['blast', { name: 'blast', desc: 'Blast', chainId: 81457, baseUrl: 'https://api.blastscan.io' }],
  [
    'blast-sepolia',
    {
      name: 'blast-sepolia',
      desc: 'Base Sepolia Testnet',
      chainId: 168587773,
      baseUrl: 'https://api-sepolia.blastscan.io'
    }
  ],
  [
    'bnb',
    { name: 'bnb', desc: 'BNB Smart Chain', chainId: 56, baseUrl: 'https://api.bscscan.com' }
  ],
  [
    'bnbt',
    {
      name: 'bnbt',
      desc: 'BNB Smart Chain Testnet',
      chainId: 97,
      baseUrl: 'https://api-testnet.bscscan.com'
    }
  ],
  [
    'opbnb',
    {
      name: 'opbnb',
      desc: 'BNB Optimistic',
      chainId: 204,
      baseUrl: 'https://api-opbnb.bscscan.com'
    }
  ],
  [
    'opbnbt',
    {
      name: 'opbnbt',
      desc: 'BNB Optimistic Testnet',
      chainId: 5611,
      baseUrl: 'https://api-opbnb-testnet.bscscan.com'
    }
  ],
  ['celo', { name: 'celo', desc: 'Celo', chainId: 42220, baseUrl: 'https://api.celoscan.io' }],
  [
    'celo-alfajores',
    {
      name: 'celo-alfajores',
      desc: 'Celo Alfajores Testnet',
      chainId: 44787,
      baseUrl: 'https://api-alfajores.celoscan.io'
    }
  ],
  ['cronos', { name: 'cronos', desc: 'Cronos', chainId: 25, baseUrl: 'https://api.cronoscan.com' }],
  [
    'dfk',
    {
      name: 'dfk',
      desc: 'DFK',
      chainId: 53935,
      baseUrl: 'https://api.routescan.io/v2/network/mainnet/evm/53935/etherscan'
    }
  ],
  ['fantom', { name: 'fantom', desc: 'Fantom', chainId: 250, baseUrl: 'https://api.ftmscan.com' }],
  [
    'fantom-testnet',
    {
      name: 'fantom-testnet',
      desc: 'Fantom Testnet',
      chainId: 4002,
      baseUrl: 'https://api-testnet.ftmscan.com'
    }
  ],
  ['xdai', { name: 'xdai', desc: 'Gnosis', chainId: 100, baseUrl: 'https://api.gnosisscan.io' }],
  [
    'linea',
    { name: 'linea', desc: 'Linea', chainId: 59144, baseUrl: 'https://api.lineascan.build' }
  ],
  [
    'linea-goerli',
    {
      name: 'linea-goerli',
      desc: 'Linea Goerli Testnet',
      chainId: 59140,
      baseUrl: 'https://api-testnet.lineascan.build'
    }
  ],
  [
    'linea-sepolia',
    {
      name: 'linea-sepolia',
      desc: 'Linea Sepolia Testnet',
      chainId: 59141,
      baseUrl: 'https://api-sepolia.lineascan.build'
    }
  ],
  [
    'moon',
    { name: 'moon', desc: 'Moonbeam', chainId: 1284, baseUrl: 'https://api-moonbeam.moonscan.io' }
  ],
  [
    'moon-moonbase',
    {
      name: 'moon-moonbase',
      desc: 'Moonbeam Moonbase Testnet',
      chainId: 1287,
      baseUrl: 'https://api-moonbase.moonscan.io'
    }
  ],
  [
    'moon-moonriver',
    {
      name: 'moon-moonriver',
      desc: 'Moonbeam Moonriver Testnet',
      chainId: 1285,
      baseUrl: 'https://api-moonriver.moonscan.io'
    }
  ],
  [
    'matic',
    { name: 'matic', desc: 'Polygon', chainId: 137, baseUrl: 'https://api.polygonscan.com' }
  ],
  [
    'matic-amoy',
    {
      name: 'matic-amoy',
      desc: 'Polygon Amoy Testnet',
      chainId: 80002,
      baseUrl: 'https://api-amoy.polygonscan.com'
    }
  ],
  [
    'matic-mumbai',
    {
      name: 'matic-mumbai',
      desc: 'Polygon Mumbai Testnet',
      chainId: 80001,
      baseUrl: 'https://api-testnet.polygonscan.com'
    }
  ],
  [
    'zkevm',
    {
      name: 'zkevm',
      desc: 'Polygon zkEVM',
      chainId: 1101,
      baseUrl: 'https://api-zkevm.polygonscan.com'
    }
  ],
  [
    'zkevm-cardona',
    {
      name: 'zkevm-cardona',
      desc: 'Polygon zkEVM Cardona',
      chainId: 2442,
      baseUrl: 'https://api-cardona-zkevm.polygonscan.com'
    }
  ],
  [
    'zkevm-testnet',
    {
      name: 'zkevm-testnet',
      desc: 'Polygon zkEVM Testnet',
      chainId: 1442,
      baseUrl: 'https://api-testnet-zkevm.polygonscan.com'
    }
  ],
  [
    'optimism',
    {
      name: 'optimism',
      desc: 'Optimism',
      chainId: 10,
      baseUrl: 'https://api-optimistic.etherscan.io'
    }
  ],
  [
    'optimism-goerli',
    {
      name: 'optimism-goerli',
      desc: 'Optimism Goerli Testnet',
      chainId: 420,
      baseUrl: 'https://api-goerli-optimistic.etherscan.io'
    }
  ],
  [
    'optimism-sepolia',
    {
      name: 'optimism-sepolia',
      desc: 'Optimism Sepolia Testnet',
      chainId: 11155420,
      baseUrl: 'https://api-sepolia-optimistic.etherscan.io'
    }
  ],
  [
    'scroll',
    { name: 'scroll', desc: 'Scroll', chainId: 534352, baseUrl: 'https://api.scrollscan.com' }
  ],
  [
    'scroll-sepolia',
    {
      name: 'scroll-sepolia',
      desc: 'Scroll Sepolia Testnet',
      chainId: 534351,
      baseUrl: 'https://api-sepolia.scrollscan.com'
    }
  ]
])

export class MyEtherscanProvider extends EtherscanProvider {
  static readonly supportedNetworks = supportedNetworks

  constructor(networkish?: Networkish, apiKey?: string) {
    if (typeof networkish === 'string') {
      const network = MyEtherscanProvider.supportedNetworks.get(networkish)
      networkish = network
      apiKey = apiKey || network?.apiKey
    }
    super(networkish, apiKey)
  }

  getBaseUrl(): string {
    const plugin = Network.from(this.network).getPlugin<EtherscanPlugin>(
      'org.ethers.plugins.provider.Etherscan'
    )
    if (plugin) return plugin.baseUrl
    const network = supportedNetworks.get(this.network.name)
    if (network) return network.baseUrl

    assertArgument(false, 'unsupported network', 'network', this.network)
  }

  async fetchContract(address: string): Promise<MyContract | null> {
    return this.getCode(address)
      .then((code) => (code !== '0x' ? new MyContract(address, this.network.name) : null))
      .catch((err) => {
        throw err
      })
  }

  async getHistory(
    address: string,
    startBlock?: BlockTag,
    endBlock?: BlockTag,
    order?: 'desc' | 'asc'
  ): Promise<Array<IMyTransaction>> {
    const params = {
      action: 'txlist',
      address,
      startblock: startBlock == null ? 0 : startBlock,
      endblock: endBlock == null ? 99999999 : endBlock,
      sort: order || 'asc',
      limit: 5
    }

    return this.fetch('account', params)
  }

  async getAbi(address: string): Promise<string | null> {
    const params = {
      action: 'getabi',
      address
    }

    return this.fetch('contract', params)
  }

  async getSource(address: string): Promise<Array<ISourceCode>> {
    const params = {
      action: 'getsourcecode',
      address
    }

    return this.fetch('contract', params)
  }

  getSupportedNetworks(): Map<string, IMyNetworkInfo> {
    return MyEtherscanProvider.supportedNetworks
  }

  getNetworkDesc(network: string): IMyNetworkInfo | undefined {
    return MyEtherscanProvider.supportedNetworks.get(network)
  }
}
