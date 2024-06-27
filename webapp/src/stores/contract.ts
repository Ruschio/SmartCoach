import { defineStore } from 'pinia'
import type { IContractSource, MyContract } from '@/models/MyContract'
import type { IMyTransaction } from '@/models/MyTransaction'
import type { IAnalysisResults } from '@/models/Analysis'

export const useContractStore = defineStore('contractStore', {
  state: () => ({
    contracts: new Map<string, MyContract>(),
    transactions: new Map<string, Map<string, IMyTransaction>>(),
    analysis: new Map<string, IAnalysisResults>(),
    updates: new Map<string, string>(),
    proxies: new Map<string, MyContract>()
  }),

  getters: {
    getContracts(state) {
      return state.contracts
    },
    getTransactions(state) {
      return state.transactions
    },
    getAnalysis(state) {
      return state.analysis
    },
    getUpdates(state) {
      return state.updates
    },
    getProxies(state) {
      return state.proxies
    },
    getContract(state) {
      return (contractId: string) => state.contracts.get(contractId)
    },
    getContractTxs(state) {
      return (contractId: string) => state.transactions.get(contractId)
    },
    getContractAnalysis(state) {
      return (contractId: string) =>
        [...state.analysis.values()].filter((a) => a.contractId === contractId)
    },
    getContractUpdate(state) {
      return (contractId: string) => state.updates.get(contractId)
    },
    getContractProxy(state) {
      return (contractId: string) => state.proxies.get(contractId)
    }
  },

  actions: {
    addContract(contract: MyContract, txs?: IMyTransaction[]) {
      this.contracts.set(contract.getId(), contract)
      this.updates.set(contract.getId(), '')
      if (txs) this.addTransactions(contract.address, txs)
    },
    addTransactions(contractId: string, txs: IMyTransaction[]) {
      const c = this.contracts.get(contractId)
      if (!c) return
      const newMap = this.transactions.get(contractId) || new Map<string, IMyTransaction>()
      const transactions = txs.reduce(
        (map, transaction) => map.set(transaction.hash, transaction),
        newMap
      )
      this.transactions.set(contractId, transactions)
    },
    addAnalysis(newAnalysis: any) {
      this.analysis.set(newAnalysis.timestamp.toString(), newAnalysis)
    },
    setContractName(contractId: string, name: string) {
      const c = this.contracts.get(contractId)
      if (!c) return
      c.name = name
      this.contracts.set(contractId, c)
    },
    setContractAbi(contractId: string, abi: string) {
      const c = this.contracts.get(contractId)
      if (!c) return
      c.abi = abi
      this.contracts.set(contractId, c)
    },
    setContractSource(contractId: string, source: IContractSource) {
      const c = this.contracts.get(contractId)
      if (!c) return
      c.source = source
      this.contracts.set(contractId, c)
    },
    setContractCode(contractId: string, code: string) {
      const c = this.contracts.get(contractId)
      if (!c) return
      c.code = code
      this.contracts.set(contractId, c)
    },
    removeContract(contractId: string) {
      this.contracts.delete(contractId)
      this.transactions.delete(contractId)
      this.updates.delete(contractId)
      this.proxies.delete(contractId)
      for (const [key, a] of this.analysis.entries()) {
        if (a.contractId === contractId) this.analysis.delete(key)
      }
    },
    setContractUpdate(contractId: string, update: string) {
      if (!this.contracts.get(contractId)) return
      this.updates.set(contractId, update)
    },
    setContractProxy(contractId: string, proxy: MyContract) {
      if (!this.contracts.get(contractId)) return
      this.proxies.set(contractId, proxy)
    },
    removeContractProxy(contractId: string) {
      this.proxies.delete(contractId)
    }
  }
  /* const contracts = ref<Map<string, MyContract>>(new Map())
  const transactions = ref<Map<string, Map<string, MyTransaction>>>(new Map())
  const analysis = ref<Map<string, IAnalysisResults>>(new Map())

  const getContracts = computed(() => contracts.value)
  const getTransactions = computed(() => transactions.value)
  const getAnalysis = computed(() => analysis.value)
  const getContract = computed(
    () =>
      (contractId: string): MyContract | undefined =>
        contracts.value.get(contractId)
  )
  const getContractTxs = computed(() => (contractId: string) => transactions.value.get(contractId))
  const getContractAnalysis = computed(
    () => (contractId: string) =>
      [...analysis.value.values()].filter((a) => a.contractId === contractId)
  )

  const addContract = (contract: MyContract, txs?: MyTransaction[]) => {
    contract.loading = true
    contracts.value.set(contract.getId(), contract)
    if (txs) addTransactions(contract.address, txs)
  }
  const addTransactions = (contractId: string, txs: MyTransaction[]) => {
    const c = contracts.value.get(contractId)
    if (!c) return
    transactions.value.set(
      contractId,
      txs.reduce((map, transaction) => {
        map.set(transaction.hash, transaction)
        return map
      }, new Map<string, MyTransaction>())
    )
    c.loading = false
  }
  const addAnalysis = (newAnalysis: any) => {
    analysis.value.set(newAnalysis.timestamp.toString(), newAnalysis)
  }
  const setContractName = (contractId: string, name: string) => {
    const c = contracts.value.get(contractId)
    if (c) {
      c.name = name
      contracts.value.set(contractId, c)
    }
  }
  const setContractAbi = (contractId: string, abi: string) => {
    const c = contracts.value.get(contractId)
    if (c) {
      c.abi = abi
      contracts.value.set(contractId, c)
    }
  }
  const setContractCode = (contractId: string, code: IContractSource) => {
    const c = contracts.value.get(contractId)
    if (c) {
      c.code = code
      contracts.value.set(contractId, c)
    }
  }
  const removeContract = (contractId: string) => {
    contracts.value.delete(contractId)
    transactions.value.delete(contractId)
    for (const [key, a] of analysis.value.entries()) {
      if (a.contractId === contractId) analysis.value.delete(key)
    }
  }

  return {
    contracts,
    transactions,
    analysis,
    getContract,
    getContracts,
    getContractTxs,
    getTransactions,
    getAnalysis,
    getContractAnalysis,
    addContract,
    removeContract,
    addTransactions,
    setContractName,
    setContractAbi,
    setContractCode,
    addAnalysis
  } */
})
