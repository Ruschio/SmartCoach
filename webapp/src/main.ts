import 'vue3-toastify/dist/index.css'
import './assets/main.css'
import 'bootstrap'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from '@/App.vue'
import router from '@/router'

import Vue3Toastify, { toast, type ToastContainerOptions } from 'vue3-toastify'
import { install as VueMonacoEditorPlugin } from '@guolao/vue-monaco-editor'

// GrimFinance https://ftmscan.com/address/0xa20e8756e0bdc405c1a92821131341c6f8232891
// UniSwap https://etherscan.io/address/0x3fc91a3afd70395cd496c647d5a6cc9d4b2b7fad
// UniSwapV2 https://etherscan.io/address/0xEf1c6E67703c7BD7107eed8303Fbe6EC2554BF6B
// UniSwapOldV2 https://etherscan.io/address/0x7a250d5630b4cf539739df2c5dacb4c659f2488d
// Wormhole https://etherscan.io/address/0x736d2a394f7810c17b3c6fed017d5bc7d60c077d
// Example https://sepolia.etherscan.io/address/0x2331fb827792879D21e11f7e13bA0d57391393D5
// Proxy Example https://etherscan.io/address/0xca1a37da14086ba21d441d137ca1ff2acc0dd3ef

// Register custom Blockchain networks
/* for (const [name, network] of supportedNetworks) {
  // Ensure network is not already registered
  if (Network.from(network.chainId).name == 'unknown')
    Network.register(network.name, () =>
      new Network(network.name, network.chainId).attachPlugin(new GasCostPlugin())
    )
} */
//supportedNetworks.forEach(network => Network.register(network.name, () => new Network(network.name, network.chainId).attachPlugin(new GasCostPlugin())))
/* const blastNetwork = new Network('blast', 81457).attachPlugin(new GasCostPlugin())
const blastSepoliaNetwork = new Network('blast-sepolia', 168587773).attachPlugin(new GasCostPlugin())
const celoNetwork = new Network('celo', 42220).attachPlugin(new GasCostPlugin())
const celoAlfajoresNetwork = new Network('celo-alfajores', 44787).attachPlugin(new GasCostPlugin())
const cronosNetwork = new Network('cronos', 25).attachPlugin(new GasCostPlugin())
const fantomNetwork = new Network('fantom', 250).attachPlugin(new GasCostPlugin())
const fantomTestnetNetwork = new Network('fantom-testnet', 4002).attachPlugin(new GasCostPlugin())
const moonNetwork = new Network('moon', 1284).attachPlugin(new GasCostPlugin())
const moonMoonbaseNetwork = new Network('moon-moonbase', 1287).attachPlugin(new GasCostPlugin())
const moonMoonriverNetwork = new Network('moon-moonriver', 1285).attachPlugin(new GasCostPlugin())
const scrollNetwork = new Network('scroll', 534352).attachPlugin(new GasCostPlugin())
const scrollSepoliaNetwork = new Network('scroll-sepolia', 534351).attachPlugin(new GasCostPlugin())
const zkevmNetwork = new Network('zkevm', 1101).attachPlugin(new GasCostPlugin())
const zkevmCardonaNetwork = new Network('zkevm-cardona', 2442).attachPlugin(new GasCostPlugin())
const zkevmTestnetNetwork = new Network('zkevm-testnet', 1442).attachPlugin(new GasCostPlugin())
Network.register(blastNetwork.name, () => blastNetwork)
Network.register(blastSepoliaNetwork.name, () => blastSepoliaNetwork)
Network.register(celoNetwork.name, () => celoNetwork)
Network.register(celoAlfajoresNetwork.name, () => celoAlfajoresNetwork)
Network.register(cronosNetwork.name, () => cronosNetwork)
Network.register(fantomNetwork.name, () => fantomNetwork)
Network.register(fantomTestnetNetwork.name, () => fantomTestnetNetwork)
Network.register(moonNetwork.name, () => moonNetwork)
Network.register(moonMoonbaseNetwork.name, () => moonMoonbaseNetwork)
Network.register(moonMoonriverNetwork.name, () => moonMoonriverNetwork)
Network.register(scrollNetwork.name, () => scrollNetwork)
Network.register(scrollSepoliaNetwork.name, () => scrollSepoliaNetwork)
Network.register(zkevmNetwork.name, () => zkevmNetwork)
Network.register(zkevmCardonaNetwork.name, () => zkevmCardonaNetwork)
Network.register(zkevmTestnetNetwork.name, () => zkevmTestnetNetwork) */

/* localForage.config({
  driver: localForage.INDEXEDDB // This force IndexedDB as the driver
}) */

/* const indexDbPlugin = async ({ store }: { store: Store }) => {
  const storeId = store.$id + '-state'
  const stored = await localForage.getItem(storeId)

  if (stored) {
      store.$patch(JSON.parse(stored.toString()))
      console.log(stored)
  }
  store.$subscribe((mutation, state) => {
    console.log("Changes", state)
    const obj = Object.fromEntries(new Map<string, MyContract>([['aaa', new MyContract('aa','aa')]]));
    localForage.setItem(storeId, JSON.stringify({'contracts': obj, 'transactions': {}, 'analysis': {}})) // Destructure to transform to plain object
  }, {deep: true})
} */

const app = createApp(App)
const pinia = createPinia()
/* pinia.use(indexDbPlugin) */

/* watch(
  () => pinia.state.value,
  (state) => {
    localForage.setItem("storeId", JSON.stringify(state))
  },
  { deep: true }
) */

app.use(pinia)
app.use(router)
app.use(Vue3Toastify, {
  autoClose: 3000,
  position: toast.POSITION.BOTTOM_CENTER
} as ToastContainerOptions)
app.use(VueMonacoEditorPlugin, {
  paths: {
    // The recommended CDN config
    vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@latest/min/vs'
  }
})

app.mount('#app')
