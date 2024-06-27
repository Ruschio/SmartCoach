<script setup lang="ts">
import { type MyContract } from '@/models/MyContract'
import { readFile } from '@/utils/files'
import { Editor } from '@guolao/vue-monaco-editor'
import { toast } from 'vue3-toastify'

// Properties
interface propsInterface {
  contract: MyContract
}
const props = defineProps<propsInterface>()
</script>

<template>
  <div class="row g-4">
    <div class="col-12 col-lg-6">
      <h5 class="d-flex justify-content-between align-items-center">
        <label for="contractCode">Contract Code:</label>
        <label class="btn btn-sm btn-secondary">
          <i class="bi bi-upload"></i> Upload
          <input
            type="file"
            accept=".sol"
            class="d-none"
            @change="
              (e: any) =>
                readFile(e.target?.files[0])
                  .then((res) => (props.contract.code = res))
                  .catch((err) => toast.error('Unable to read the file'))
            "
          />
        </label>
      </h5>
      <Editor
        id="contractCode"
        height="500px"
        language="sol"
        theme="vs-dark"
        :line="2"
        v-model:value="contract.code"
      />
    </div>
    <div class="col-12 col-lg-6">
      <h5 class="d-flex justify-content-between align-items-center">
        <label for="contractAbi">Contract ABI:</label>
        <label class="btn btn-sm btn-secondary">
          <i class="bi bi-upload"></i> Upload
          <input
            type="file"
            accept=".json"
            class="d-none"
            @change="
              (e: any) =>
                readFile(e.target?.files[0])
                  .then((res) => (props.contract.abi = res))
                  .catch((err) => toast.error('Unable to read the file'))
            "
          />
        </label>
      </h5>
      <Editor
        id="contractAbi"
        height="500px"
        language="json"
        theme="vs-dark"
        v-model:value="contract.abi"
      />
    </div>
  </div>
</template>

<style scoped>
#contractAbi,
#contractCode {
  border: 1px solid var(--color-border-hover);
  border-radius: 0.5rem;
  overflow: hidden;
}
</style>
