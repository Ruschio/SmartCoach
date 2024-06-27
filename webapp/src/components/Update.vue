<script setup lang="ts">
import { readFile } from '@/utils/files'
import { type MyContract } from '@/models/MyContract'
import { analyzeContract, compileContract } from '@/services/contractService'
import { useContractStore } from '@/stores/contract'
import { DiffEditor } from '@guolao/vue-monaco-editor'
import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api'
import { toast } from 'vue3-toastify'
import { computed, ref, toRef, watch } from 'vue'

// Properties
interface propsInterface {
  contract: MyContract
}
const props = defineProps<propsInterface>()

// Data
const { getContractUpdate, setContractUpdate, addAnalysis } = useContractStore()
const codeEvolved = computed(() => getContractUpdate(props.contract.getId()))
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
const analyze = () => {
  if (!codeEvolved.value) return toast.error('No code to analyze')
  analyzeContract(props.contract.getId(), codeEvolved.value, selectedTools.value).then((res) => {
    if (res) return addAnalysis(res)
    return toast.error('Analysis failed')
  })
}
const updateCode = (editor: monacoEditor.editor.IStandaloneDiffEditor) => {
  const modifiedEditor = editor.getModifiedEditor()
  modifiedEditor.onDidChangeModelContent(() =>
    setContractUpdate(props.contract.getId(), modifiedEditor.getValue())
  )
}
</script>

<template>
  <div class="row g-4">
    <div class="col-12">
      <h5 class="d-flex justify-content-between align-items-center">
        <label for="contractCode">Update Code</label>
        <label class="btn btn-sm btn-secondary">
          <i class="bi bi-upload"></i> Upload
          <input
            type="file"
            accept=".sol"
            class="d-none"
            @change="
              (e: any) =>
                readFile(e.target?.files[0])
                  .then((res) => setContractUpdate(contract.getId(), res))
                  .catch((err) => toast.error('Unable to read the file'))
            "
          />
        </label>
      </h5>
      <DiffEditor
        id="contractCodeEvolved"
        height="500px"
        language="sol"
        theme="vs-dark"
        :original="contract.code || '// No available code for this contract'"
        :modified="
          getContractUpdate(props.contract.getId()) || '// Paste or upload the updated source code'
        "
        :onMount="updateCode"
      />
    </div>

    <h5 class="col-12 mt-5">Test contract</h5>
    <div class="col-12 tools">
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
  </div>
</template>

<style scoped>
#contractCodeEvolved {
  border: 1px solid var(--color-border-hover);
  border-radius: 0.5rem;
  overflow: hidden;
}

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
