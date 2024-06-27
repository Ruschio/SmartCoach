<script setup lang="ts">
import { MyEtherscanProvider } from '@/models/MyEtherscanProvider'
import { ref, watch } from 'vue'

// Properties
interface propsInterface {
  input: string
  loading: boolean
}
const props = defineProps<propsInterface>()

// Data
const contractAddress = ref<string>('')
const selectedNetwork = ref<string>('')

// Emits
const emit = defineEmits(['update:input', 'submitForm'])
const addressChange = () => emit('update:input', contractAddress.value.trim())
const formSubmit = () =>
  emit('submitForm', { address: contractAddress.value.trim(), network: selectedNetwork.value })

// Watch
watch(
  () => props.input,
  (newInput) => (contractAddress.value = newInput)
)

/* async function getTransactions(contract: ethers.Contract) {
  try {
    const genesisTx = await provider.getTransaction(address)
        const genesisBlock = genesisTx?.blockNumber
    // Retrieve the latest 10 transactions to the contract
    const contractAddress = await contract.getAddress()
    const txs = await provider.getLogs({
            address: contractAddress,
            fromBlock: 19525179,
            toBlock: 'latest'
        });
        console.log(txs)

    let transactions = await etherscanProvider.getHistory(
      contractAddress,
      undefined,
      undefined,
      'desc'
    )
    // Log the transactions
    console.log(`Last ${transactions.length} transactions to the contract:`)
    transactions.slice(0, 10).forEach((tx) => {
      console.log(`Tx Hash: ${tx.hash}, From: ${tx.from}, To: ${tx.to}, Value: ${tx.data}`, tx)
    })
  } catch (error) {
    console.error('Error fetching contract transactions:', error)
  }
} */
</script>

<template>
  <form id="contractSearch" class="d-flex" @submit.prevent="formSubmit">
    <input
      type="text"
      class="form-control form-control-lg me-3"
      v-model.trim="contractAddress"
      placeholder="Contract address ..."
      :disabled="loading"
      @input="addressChange"
      required
      autofocus
    />
    <div class="btn-group">
      <button
        type="button"
        class="btn btn-primary dropdown-toggle px-3 px-lg-4 rounded-3"
        :class="loading ? 'loading' : ''"
        :disabled="loading"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <div class="spinner" v-if="loading">
          <span class="spinner-border spinner-border-sm me-1" aria-hidden="true"></span>
        </div>
        <span class="me-1">Add from</span>
      </button>
      <ul class="dropdown-menu dropdown-menu-end">
        <li v-for="[net, info] in MyEtherscanProvider.supportedNetworks">
          <button class="dropdown-item" @click="selectedNetwork = net">{{ info.desc }}</button>
        </li>
      </ul>
    </div>
  </form>
</template>

<style scoped>
#contractSearch {
  top: 0;
  position: sticky;
}

.dropdown-menu {
  max-height: 200px;
  overflow-y: scroll;
}

button.loading {
  color: transparent;
}

button.loading .spinner {
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
}
</style>
