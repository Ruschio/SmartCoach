import { MyEtherscanProvider } from '@/models/MyEtherscanProvider'
import { type IMyWallet } from '@/models/MyWallet'
import { type MyContract } from '@/models/MyContract'
import { useWalletStore } from '@/stores/wallet'
import { BrowserProvider, Contract, ContractFactory } from 'ethers'
import { toast } from 'vue3-toastify'
import { toRaw } from 'vue'

const { ethereum } = window

const initWallet = async () => {
  if (!ethereum) return console.log('No provider detected')

  const accounts = await ethereum.request({ method: 'eth_accounts' })
  if (accounts.length > 0) updateWallet()
  const { resetWallet } = useWalletStore()
  ethereum.on('accountsChanged', (accounts: string[]) =>
    accounts.length == 0 ? resetWallet() : updateWallet()
  )
  ethereum.on('chainChanged', updateWallet)
  ethereum.on('connect', updateWallet)
  ethereum.on('disconnect', resetWallet)
}

const connectWallet = async () => {
  if (!ethereum) return toast.error('Metamask is not connected')

  try {
    await updateWallet()
    toast.success('Connected to Metamask')
    console.log('Connected to Metamask')
  } catch (error) {
    toast.error('Unable to connect Metamask. Retry please.')
    console.error('Error connecting to Metamask:', error)
  }
}

const updateWallet = async () => {
  const { setWallet } = useWalletStore()
  const provider = new BrowserProvider(ethereum)
  const signer = await provider.getSigner()
  const chain = await provider.getNetwork()
  const address = signer.address
  const wallet: IMyWallet = {
    address,
    chain,
    signer,
    provider
  }
  setWallet(wallet)
}

const switchNetwork = async (chainId: number) => {
  await ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: '0x' + chainId.toString(16) }]
  })
  return await new BrowserProvider(ethereum).getSigner()
}

const callFunction = async (contract: MyContract, func: string, args: any[]) => {
  if (!contract.abi) throw 'Missing contract abi'
  const { getSigner, getChain } = useWalletStore()
  const signerNetwork = toRaw(getChain)
  const contractNetwork = MyEtherscanProvider.supportedNetworks.get(contract.network)
  if (!contractNetwork) throw 'Missing network in the contract'
  const signer = Number(signerNetwork?.chainId) != contractNetwork.chainId ? await switchNetwork(contractNetwork.chainId) : toRaw(getSigner)
  const con = new Contract(contract.address, contract.abi, signer)

  try {
    const tx = await con[func](...args)
    toast.success(`Method '${func}' executed successfully.`)
    return tx
  } catch(err: any) {
    toast.error(err.info.error.message)
    throw err
  }
}

const deployContract = async (abi: string, bytecode: string, args: any[], network: string) => {
  // The factory we use for deploying contracts
  const { getSigner, getChain } = useWalletStore()
  const signerNetwork = toRaw(getChain)
  const contractNetwork = MyEtherscanProvider.supportedNetworks.get(network)
  if (!contractNetwork) throw 'Missing network in the contract'
  const factory = new ContractFactory(abi, bytecode, Number(signerNetwork?.chainId) != contractNetwork.chainId ? await switchNetwork(contractNetwork.chainId) : toRaw(getSigner))
  
  try {
    const contract = await factory.deploy(...args)
    return contract
  } catch(err: any) {
    throw err
  }
}

export { initWallet, connectWallet, callFunction, deployContract }