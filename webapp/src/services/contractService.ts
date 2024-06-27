import { MyEtherscanProvider } from '@/models/MyEtherscanProvider'
import { MyContract, type IContractSource } from '@/models/MyContract'
import { type IMultipleSources } from '@/models/EtherscanResults'
import { type IAnalysisResults } from '@/models/Analysis'
import { type ICompileResults } from '@/models/Compile'
import { type IFlattenResults } from '@/models/Flatten'
import { useContractStore } from '@/stores/contract'
import { backendAXIOS } from '@/configs/axios'
import { toast } from 'vue3-toastify'

const parseSourceCode = (name: string, source: string): IContractSource => {
  const sourceCode: IContractSource = {}
  source = source.replace(/^(\{+)/, '{').replace(/(\}+)$/, '}')
  if (!source.startsWith('{') || !source.endsWith('}')) sourceCode[name] = source
  else {
    const multipleSource = (JSON.parse(source) as IMultipleSources).sources
    for (const s in multipleSource) sourceCode[s] = multipleSource[s].content
  }
  return sourceCode
}

const parseRemappings = (source: string): Array<string> => {
  source = source.replace(/^(\{+)/, '{').replace(/(\}+)$/, '}')
  if (!source.startsWith('{') || !source.endsWith('}')) return []
  return (JSON.parse(source) as IMultipleSources).settings?.remappings ?? []
}

const fetchContract = async (
  address: string,
  network?: string
): Promise<MyContract | undefined> => {
  const {
    getContract,
    addContract,
    addTransactions,
    setContractAbi,
    setContractName,
    setContractSource,
    setContractCode
  } = useContractStore()
  const provider = new MyEtherscanProvider(network)
  // Get contract from provider
  return provider
    .fetchContract(address)
    .then((contract) => {
      if (!contract) {
        toast.warning('The address does not refer to a contract')
        return undefined
      }

      // Add contract to store
      contract.loading = true
      addContract(contract)
      toast.success('Contract added')

      // Get contract transactions
      const promiseTxs = new Promise((resolve, reject) => {
        provider
          .getHistory(address, undefined, undefined, 'desc')
          .then((txs) => {
            addTransactions(contract.getId(), txs)
            toast.success('Loaded transactions for contract ' + address)
          })
          .catch((err) => toast.error("Unable to load contract's transactions"))
          .finally(() => resolve(true))
      })

      // Get contract information (source code, abi, name)
      const promiseInfo = new Promise((resolve, reject) => {
        provider
          .getSource(address)
          .then(async (code) => {
            const abi = await provider.getAbi(address)
            const sourceCode = parseSourceCode(code[0].ContractName, code[0].SourceCode)
            const remappings = parseRemappings(code[0].SourceCode)
            const flattenedCode =
              Object.values(sourceCode).length == 1
                ? Object.values(sourceCode)[0]
                : await flattenContract(code[0].ContractName, sourceCode, remappings)

            setContractCode(contract.getId(), flattenedCode || '')
            setContractAbi(contract.getId(), abi || '')
            setContractName(contract.getId(), code[0].ContractName)
            setContractSource(contract.getId(), sourceCode)
            toast.success('Loaded information for contract ' + address)
          })
          .catch((err) => toast.error("Unable to load contract's code"))
          .finally(() => resolve(true))
      })

      // Finish contract loading
      Promise.all([promiseInfo, promiseTxs]).then(async () => {
        const c = getContract(contract.getId())
        if (c) c.loading = false
      })

      return getContract(contract.getId())
    })
    .catch((err) => {
      toast.error('Unable to load the contract')
      return undefined
    })
}

const analyzeContract = (
  contractId: string,
  code: string,
  tools: Array<string>
): Promise<IAnalysisResults | null> => {
  return backendAXIOS
    .post('/analysis', { contractId, code, tools })
    .then((res: { data: IAnalysisResults }) => {
      toast.success('Analysis completed')
      return res.data
    })
    .catch((err) => {
      toast.error('Analysis failed')
      return null
    })
}

const compileContract = (code: string): Promise<ICompileResults | null> => {
  return backendAXIOS
    .post('/compile', { code })
    .then((res: { data: ICompileResults }) => {
      toast.success('Contract compiled with solidity version ' + res.data.solidity)
      return res.data
    })
    .catch((err) => {
      toast.error('Unable to compile the code: ' + err.response.data)
      return null
    })
}

const flattenContract = (
  contractName: string,
  code: IContractSource,
  remappings: Array<string> = []
): Promise<string | null> => {
  return backendAXIOS
    .post('/flatten', { contractName, code, remappings })
    .then((res: { data: IFlattenResults }) => {
      toast.success('Contract flattened')
      return res.data.code
    })
    .catch((err) => {
      toast.error("Unable to flatten contract's code")
      return null
    })
}

// Get proxy contract from provider
const fetchProxy = async (
  contractId: string,
  address: string,
  network?: string
): Promise<MyContract | undefined> => {
  const { setContractProxy } = useContractStore()
  const provider = new MyEtherscanProvider(network)
  return provider
    .fetchContract(address)
    .then(async (proxy) => {
      if (!proxy) {
        toast.warning('The address does not refer to a contract')
        return undefined
      }
      const abi = await provider.getAbi(address)
      abi ? (proxy.abi = abi) : toast.error('Unable to get proxy abi')
      setContractProxy(contractId, proxy)
      toast.success('Proxy is being added')
      return proxy
    })
    .catch((err) => {
      toast.error('Unable to get the contract')
      return undefined
    })
}

export {
  analyzeContract,
  compileContract,
  flattenContract,
  fetchContract,
  fetchProxy
}
