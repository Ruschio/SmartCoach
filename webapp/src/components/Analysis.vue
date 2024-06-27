<script setup lang="ts">
import { analyzeContract } from '@/services/contractService'
import { type MyContract } from '@/models/MyContract'
import { useContractStore } from '@/stores/contract'
import { toast } from 'vue3-toastify'
import { computed, ref } from 'vue'

// Properties
interface propsInterface {
  contract: MyContract
}
const props = defineProps<propsInterface>()

// Data
const { getContractAnalysis, addAnalysis } = useContractStore()
const tools = ref<Array<string>>([
  'confuzzius',
  'conkas',
  'maian',
  'manticore',
  'mythril',
  'oyente',
  'osiris',
  'sfuzz',
  'slither',
  'smartcheck',
  'solhint'
])
const selectedTools = ref<Array<string>>([])
const allSelected = computed(() => tools.value.length == selectedTools.value.length)

// Methods
const selectAll = (select: boolean) => (selectedTools.value = select ? tools.value : [])
const analyze = async () => {
  const code = props.contract?.code
  if (!code) return toast.error('No code to analyze')
  const analysis = await analyzeContract(props.contract.getId(), code, selectedTools.value)
  if (analysis) return addAnalysis(analysis)
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
          :value="allSelected"
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
    <div id="analysisList" class="col-12 mt-5 accordion">
      <div
        v-for="analysis in getContractAnalysis(contract.getId())"
        class="analysis accordion-item"
      >
        <div class="accordion-header">
          <button
            class="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            :data-bs-target="'#' + analysis.timestamp.toString()"
            aria-expanded="false"
            :aria-controls="analysis.timestamp.toString()"
          >
            <div>
              <div>
                <i class="bi bi-clock me-2"></i>
                {{ new Date(analysis.timestamp).toLocaleString() }}
              </div>
              <div>
                <i class="bi bi-gear me-2"></i>
                {{ Object.keys(analysis.results).toString().toUpperCase() }}
              </div>
            </div>
          </button>
        </div>
        <div
          :id="analysis.timestamp.toString()"
          class="accordion-collapse collapse"
          data-bs-parent="#analysisList"
        >
          <div class="accordion-body">
            <div v-for="(result, toolName) in analysis.results">
              <h5>{{ toolName }}</h5>
              <div v-for="finding in result.findings" class="my-1">
                {{ finding.line }}
                {{ finding.line_end ? ' - ' + finding.line_end : '' }}
                {{ finding.message }}
              </div>
            </div>
          </div>
        </div>
      </div>
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

#analysisList {
  margin: 1rem 0;
  display: flex;
  flex-flow: column;
  gap: 1rem;
}

#analysisList .analysis {
  overflow: hidden;
  border: none;
  border-radius: 0.5rem;
  background-color: var(--color-background-mute);
}

#analysisList .analysis .accordion-button,
#analysisList .analysis .accordion-body {
  color: var(--color-text);
  padding: 1rem 2rem;
  border: none;
  background-color: var(--color-background-mute);
}
</style>
