<script setup lang="ts">
import { analyzeContract } from '@/services/contractService'
import { computed, ref } from 'vue'
import type { MyContract } from '@/models/MyContract'
import { useContractStore } from '@/stores/contract'
import { toast } from 'vue3-toastify'

// Properties
interface propsInterface {
  contract: MyContract
}
const props = defineProps<propsInterface>()

// Data
const { addAnalysis } = useContractStore()
const tools = ref<Array<string>>([
  'confuzzius',
  'conkas',
  'maian',
  'manticore',
  'mythril',
  'oyente',
  'osiris',
  'sfuzz',
  'slither'
])
const selectedTools = ref<Array<string>>([])
const allSelected = computed(() => tools.value.length == selectedTools.value.length)

// Methods
const selectAll = (select: boolean) => (selectedTools.value = select ? tools.value : [])
const analyze = () => {
  const code = props.contract?.code
  if (!code) return toast.error('No code to analyze')
  analyzeContract(props.contract.getId(), code, selectedTools.value).then((res) => {
    if (res) return addAnalysis(res)
    return toast.error('Analysis failed')
  })
}
</script>

<template>
  <div class="row">
    <div class="col-12 mb-4 tools">
      <label class="all tool" for="selectAll">
        <input
          type="checkbox"
          name="selectAll"
          id="selectAll"
          v-model="allSelected"
          @click="selectAll(!allSelected)"
        />
        {{ allSelected ? 'Unselect all' : 'Select all' }}
      </label>
      <label v-for="tool in tools" class="tool" :for="tool">
        <input type="checkbox" name="tools" v-model="selectedTools" :id="tool" :value="tool" />
        {{ tool.toUpperCase() }}
      </label>
    </div>
    <div class="col-12">
      <button class="btn btn-primary" @click="analyze" :disabled="selectedTools.length == 0">
        {{ selectedTools.length != 0 ? 'Start analysis' : 'Select at least one tool' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.tools {
  display: flex;
  flex-flow: row wrap;
  gap: 1rem;
}

.tools .tool {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  background-color: var(--color-background-mute);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  cursor: pointer;
}

.tools .all {
  background-color: transparent;
}

.tools .all input {
  display: none;
}
</style>
