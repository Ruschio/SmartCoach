<script setup lang="ts">
import { fetchContract } from '@/services/contractService'
import { useContractStore } from '@/stores/contract'
import { MyEtherscanProvider } from '@/models/MyEtherscanProvider'
import FadeTransition from '@/components/FadeTransition.vue'
import { computed, onMounted, ref, toRef, watch } from 'vue'
import router from '@/router'

// Properties
interface propsInterface {
  address: string
  network: string
}
const props = defineProps<propsInterface>()

// Data
const { getContract, setContractName } = useContractStore()
const contract = computed(() => getContract(props.address + '@' + props.network))
const contractName = ref<string>(contract.value?.name || '')

// Lifecycle
onMounted(async () => {
  if (contract.value) return
  if (!(await fetchContract(props.address, props.network))) router.push('/')
})

watch(
  () => contract.value?.name,
  (newName) => (contractName.value = newName || '')
)
</script>

<template>
  <div class="container-fluid p-0 m-0 h-100">
    <header class="pt-4 pb-2 sticky-top">
      <h2>
        <RouterLink id="backhome" alt="Back home" to="/">
          <i class="bi bi-filter-left"></i>
        </RouterLink>
        <input
          id="contractName"
          v-model.trim="contractName"
          :placeholder="contract?.loading ? 'Loading contract ...' : 'Enter contract name ...'"
          @input="setContractName(props.address + '@' + props.network, contractName)"
          :disabled="contract?.loading"
        />
      </h2>
      <h6 v-if="contract?.address" class="info mb-1">
        <i class="bi bi-hash me-2"></i>
        <span>{{ contract.address }}</span>
      </h6>
      <h6 v-if="contract?.network" class="info mb-1">
        <i class="bi bi-link-45deg me-2"></i>
        <span>{{ MyEtherscanProvider.supportedNetworks.get(contract.network)?.desc }}</span>
      </h6>
      <nav class="mt-4">
        <RouterLink to="contract" activeClass="active">Contract</RouterLink>
        <RouterLink to="transactions" activeClass="active">Transactions</RouterLink>
        <RouterLink to="analysis" activeClass="active">Analysis</RouterLink>
        <RouterLink to="update" activeClass="active">Update</RouterLink>
        <RouterLink to="evolution" activeClass="active">Evolution</RouterLink>
      </nav>
    </header>
    <main class="my-5">
      <div v-if="!contract || contract?.loading">
        <span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
        Loading contract
      </div>

      <RouterView v-else :contract="contract" v-slot="{ Component }">
        <FadeTransition>
          <component :is="Component" />
        </FadeTransition>
      </RouterView>
    </main>
  </div>
</template>

<style scoped>
header {
  background: var(--color-background);
  box-shadow: 0 0 1rem 1.25rem var(--color-background);
}

header .info {
  color: var(--color-text-soft);
  display: flex;
}

header .info span {
  overflow: hidden;
  text-overflow: ellipsis;
}

nav {
  display: flex;
  flex-flow: row wrap;
  gap: 1.5rem;
}

nav > a {
  color: var(--color-text);
  background-color: transparent;
  border-bottom: 2px solid transparent;
}

nav > a:hover,
nav > a:focus {
  color: var(--color-primary);
}

nav > a.active {
  color: var(--color-primary);
  border-bottom: 2px solid var(--color-primary);
  box-shadow: 0 0.75rem 1.5rem -0.75rem var(--color-primary);
}

#backhome {
  border-radius: 0.5rem;
}

#contractName {
  padding: 0 0.5rem;
  color: var(--color-text);
  background-color: transparent;
  border: none;
  border-radius: 0.5rem;
}
</style>
