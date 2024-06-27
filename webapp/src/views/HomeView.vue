<script setup lang="ts">
import ContractSearch from '@/components/ContractSearch.vue'
import ContractList from '@/components/ContractList.vue'
import { fetchContract } from '@/services/contractService'
import { useContractStore } from '@/stores/contract'
import { toast } from 'vue3-toastify'
import { ref } from 'vue'

// Data
const { getContract } = useContractStore()
const contractAddress = ref('')
const loading = ref(false)

// Methods
const addContract = async ({ address, network }: { address: string; network: string }) => {
  if (getContract(address + '@' + network)) return toast.warning('Contract already added')
  loading.value = true
  // Get contract from provider
  await fetchContract(address, network)
  contractAddress.value = ''
  loading.value = false
}
</script>

<template>
  <div>
    <h2 class="mb-0">Your contracts</h2>
    <ContractSearch
      class="py-3"
      v-model:input="contractAddress"
      :loading="loading"
      @submitForm="addContract"
    />
    <ContractList class="my-3" :filter="contractAddress" />
  </div>
</template>
