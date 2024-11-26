<script setup lang="ts">
import { MyEtherscanProvider } from '@/models/MyEtherscanProvider'
import { useContractStore } from '@/stores/contract'
import { toast } from 'vue3-toastify'
import { computed, ref } from 'vue'

// Properties
interface propsInterface {
  filter: string
}
const props = defineProps<propsInterface>()

// Methods
const { getContracts, getContractTxs, removeContract } = useContractStore()

const deleteContract = (contractId: string) => {
  removeContract(contractId)
  toast.success('Contract removed')
}

const filterContracts = computed(() =>
  [...getContracts.values()]
    .reverse()
    .filter(
      (c) =>
        c.name?.toLowerCase().includes(props.filter.toLowerCase()) ||
        c.address.includes(props.filter) ||
        MyEtherscanProvider.supportedNetworks
          .get(c.network)
          ?.desc.toLowerCase()
          .includes(props.filter.toLowerCase())
    )
)
</script>

<template>
  <div id="contractList">
    <div v-if="getContracts.size == 0" class="contract">Add your first contract!</div>
    <div v-else-if="filterContracts.length == 0" class="contract">
      No contract matches your search
    </div>
    <TransitionGroup name="list" v-else>
      <RouterLink
        v-for="contract of filterContracts"
        :key="contract.address"
        :to="'/contract/' + contract.network + '/' + contract.address"
        class="contract"
      >
        <div class="info">
          <h4 v-if="contract.name">{{ contract.name }}</h4>
          <h5 v-if="contract.address" class="chain mb-1">
            <i class="bi bi-hash me-2"></i>
            <span>{{ contract.address }}</span>
          </h5>
          <h5 v-if="contract.network" class="chain mb-1">
            <i class="bi bi-link-45deg me-2"></i>
            <span>{{ MyEtherscanProvider.supportedNetworks.get(contract.network)?.desc }}</span>
          </h5>
          <div v-if="contract.loading" class="mt-2">
            <span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
            Loading contract
          </div>
          <div v-else class="mt-2">
            The contract has
            {{ getContractTxs(contract.getId())?.size ?? 'no' }} transactions
          </div>
        </div>
        <div class="actions">
          <button
            v-if="!contract.loading"
            class="btn btn-outline-secondary"
            @click.stop.prevent="deleteContract(contract.getId())"
          >
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </RouterLink>
    </TransitionGroup>
  </div>
</template>

<style scoped>
#contractList {
  padding: 0;
  display: flex;
  flex-flow: column;
  gap: 1rem;
}

#contractList .contract {
  padding: 1.5rem 2rem;
  border-radius: 0.5rem;
  background-color: var(--color-background-soft);
  transition: 0.2s ease-in-out;
  display: flex;
  justify-content: space-between;
}

#contractList .contract:hover {
  background-color: var(--color-background-mute);
  transform: scale(1.03);
}

#contractList .contract .info {
  color: var(--color-text);
  overflow: hidden;
}

#contractList .contract:hover .info > :first-child {
  color: var(--color-primary);
}

#contractList .contract .info > .chain {
  color: var(--color-text-soft);
  font-size: 1.125rem;
  display: flex;
}

#contractList .contract .info > .chain span {
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 992px) {
  #contractList .contract {
    padding: 1.5rem;
  }
}
</style>
