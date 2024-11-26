<script setup lang="ts">
import ContractSearch from '@/components/ContractSearch.vue'
import { fetchProxy, compileContract } from '@/services/contractService'
import { callFunction, deployContract } from '@/services/walletService'
import { MyEtherscanProvider } from '@/models/MyEtherscanProvider'
import { MyContract } from '@/models/MyContract'
import { type ICompileResults } from '@/models/Compile'
import { useContractStore } from '@/stores/contract'
import { Contract, FunctionFragment, ParamType, Interface } from 'ethers'
import { toast } from 'vue3-toastify'
import { computed, ref, watch } from 'vue'

// Properties
interface propsInterface {
  contract: MyContract
}
const props = defineProps<propsInterface>()

// Data
const { getContractUpdate, getContractProxy, removeContractProxy } = useContractStore()
const proxyLoading = ref(false)
const compileLoading = ref(false)
const executeLoading = ref(false)
const deployLoading = ref(false)
const proxyAddress = ref('')
const proxyContract = computed(() => getContractProxy(props.contract.getId()))
const proxyFunctions = computed(() =>
  new Map<string, FunctionFragment>(
    proxyContract.value?.abi
      ? (new Contract(
          proxyContract.value?.address,
          proxyContract.value.abi
        ).interface.fragments.filter(
          (fragment) => fragment.type === 'function'
        ) as FunctionFragment[]).map(
          func => [func.name, func]
        )
      : []
  )
)
const selectedFunction = ref<FunctionFragment>()
const functionInputs = ref<Array<any>>(Array(0))
const updatedCode = computed(() => getContractUpdate(props.contract.getId()))
const compiled = ref<ICompileResults | null>(null)
const contractConstructor = computed(() => compiled.value ? new Interface(JSON.stringify(compiled.value.abi)).deploy : null)
const constructorInputs = computed(() => Array(contractConstructor.value?.inputs.length))
const deployMessage = ref<string>()

// Methods
const addProxy = async ({ address, network }: { address: string; network: string }) => {
  proxyLoading.value = true
  // Get proxy contract from provider
  await fetchProxy(props.contract.getId(), address, network)
  proxyAddress.value = ''
  proxyLoading.value = false
}
const getInputType = (input: ParamType): 'number' | 'boolean' | 'text' => {
  const type = input.baseType
  if (type.startsWith('uint') || type.startsWith('int')) return 'number'
  if (type == 'bool') return 'boolean'
  return 'text'
}
const deploy = async (network: string) => {
  if (!compiled.value) return
  deployLoading.value = true
  try {
    const contract = await deployContract(JSON.stringify(compiled.value.abi), compiled.value.bytecode, [], network)
    await contract.deploymentTransaction()?.wait(2)
    const address = await contract.getAddress()
    deployMessage.value = 'Contract deployed with address ' + address
    toast.success('Contract deployed successfully')
  } catch (error) {
    deployMessage.value = undefined
    toast.error('Error while deploying the contract')
  }
  deployLoading.value = false
}

// Watch
watch(
  () => updatedCode.value,
  async (code) => {
    compileLoading.value = true
    compiled.value = code ? await compileContract(code) : null
    deployMessage.value = undefined
    compileLoading.value = false
  },
  { immediate: true }
)
watch(
  () => selectedFunction.value,
  () => functionInputs.value = new Array(selectedFunction.value?.inputs.length)
)
</script>

<template>
  <div class="row g-4">
    <div class="col-12 col-lg-8">
      <div class="deploy">
        <template v-if="!proxyContract">
          <h5 class="mb-3">Connect proxy</h5>
          <ContractSearch v-model:input="proxyAddress" :loading="proxyLoading" @submitForm="addProxy" />
          <!-- <button class="btn btn-primary" @click="connectWallet()">Connect Wallet</button> -->
        </template>
        <template v-else>
          <h5 class="proxy mb-1">
            Proxy contract
            <button
              class="btn btn-sm btn-outline-secondary"
              @click="removeContractProxy(contract.getId())"
            >
              Detach proxy
            </button>
          </h5>
          <h6 class="info mb-1">
            <i class="bi bi-hash me-2"></i>
            <span>{{ proxyContract.address }}</span>
          </h6>
          <h6 class="info mb-3">
            <i class="bi bi-link-45deg me-2"></i>
            <span>{{ MyEtherscanProvider.supportedNetworks.get(proxyContract.network)?.desc }}</span>
          </h6>
          <div v-if="compileLoading">
            <span class="spinner-border spinner-border-sm me-1" aria-hidden="true"></span>
            Compiling contract
          </div>
          <div v-else-if="proxyContract?.abi" class="mt-4">
            <select class="form-select mb-2" v-model="selectedFunction">
              <option value="" disabled selected>Select proxy function</option>
              <option v-for="[id, func] of proxyFunctions" :value="func" :key="id">{{ func.name }}</option>
            </select>
            <form
              v-if="selectedFunction"
              class="row function"
              @submit.prevent="callFunction(proxyContract, selectedFunction.name, functionInputs)"
            >
              <div v-if="selectedFunction.inputs.length == 0">No input parameters</div>
              <div v-for="(input, index) of selectedFunction.inputs" class="col-12 mt-1">
                <label v-if="input.name">{{ input.name }}</label>
                <select
                  v-if="getInputType(input) === 'boolean'"
                  class="form-select form-select-sm"
                  required
                >
                  <option value="" disabled selected>{{ input.baseType }}</option>
                  <option :value="true">true</option>
                  <option :value="false">false</option>
                </select>
                <div class="input-group" v-else-if="input.type.startsWith('bytes')">
                  <input
                    class="form-control form-control-sm"
                    :type="getInputType(input)"
                    :placeholder="input.type"
                    v-model="functionInputs[index]"
                    required
                  />
                  <button 
                    type="button"
                    class="btn btn-primary btn-sm"
                    @click="functionInputs[index] = '0x' + compiled?.bytecode"
                  >
                    <i class="bi bi-copy"></i>
                  </button>
                </div>
                <input
                  v-else
                  class="form-control form-control-sm"
                  :type="getInputType(input)"
                  :placeholder="input.type"
                  v-model="functionInputs[index]"
                  required
                />
              </div>
              <div class="col-auto mt-4">
                <button type="submit" class="btn btn-primary px-3 px-lg-4 rounded-3 col-auto">
                  <div class="spinner" v-if="executeLoading">
                    <span class="spinner-border spinner-border-sm me-1" aria-hidden="true"></span>
                  </div>
                  <span class="me-1">Execute</span>
                </button>
              </div>
            </form>
            <!-- <form
              v-for="func of proxyFunctions"
              class="row g-1 mb-2 function"
              @submit.prevent="callFunction(proxyContract, func.name, functionInputs[func.name])"
            >
              <button
                type="submit"
                class="btn bi bi-caret-right-square col-auto exec me-2 p-0"
              ></button>
              <span class="col-auto">{{ func.name }}(</span>
              <div v-for="(input, index) of func.inputs" class="col-auto">
                <select
                  v-if="getInputType(input) === 'boolean'"
                  class="form-select form-select-sm"
                  required
                >
                  <option value="" disabled selected>{{ input.baseType }}</option>
                  <option :value="true">true</option>
                  <option :value="false">false</option>
                </select>
                <input
                  v-else
                  class="form-control form-control-sm"
                  :type="getInputType(input)"
                  :placeholder="input.type"
                  v-model="functionInputs[func.name][index]"
                  required
                />
              </div>
              <span class="col-auto">)</span>
            </form> -->
          </div>
          <!-- <button
            class="btn btn-primary"
            @click="codeEvolved ? compileContract(codeEvolved) : toast.error('No code to compile')"
          >
            Compile
          </button> -->
        </template>
      </div>
    </div>
    <div class="col-12 col-lg-4">
      <div class="deploy text-center">
        <h5 class="mb-4">Direct deploy</h5>
        <div v-if="!updatedCode">The updated contract is empty</div>
        <div v-else-if="compileLoading">
          <span class="spinner-border spinner-border-sm me-1" aria-hidden="true"></span>
          Compiling contract
        </div>
        <div v-else-if="contractConstructor?.inputs.length">
          <div v-for="(input, index) of contractConstructor?.inputs" class="col-auto">
            <select
              v-if="getInputType(input) === 'boolean'"
              class="form-select form-select-sm"
              required
            >
              <option value="" disabled selected>{{ input.baseType }}</option>
              <option :value="true">true</option>
              <option :value="false">false</option>
            </select>
            <input
              v-else
              class="form-control form-control-sm"
              :type="getInputType(input)"
              :placeholder="input.type"
              v-model="constructorInputs[index]"
              required
            />
          </div>
        </div>
        <div v-else>{{ deployMessage || 'You are ready for deploy!' }}</div>
        <div class="btn-group mt-4">
          <button
            type="button"
            class="btn btn-primary dropdown-toggle px-3 px-lg-4 rounded-3"
            :disabled="!compiled"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <span v-if="deployLoading" class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
            <span class="me-1">{{ deployLoading ? 'Deploying' : 'Deploy' }}</span>
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li v-for="[net, info] in MyEtherscanProvider.supportedNetworks">
              <button class="dropdown-item" @click="deploy(net)">{{ info.desc }}</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.deploy {
  padding: 1.5rem 2rem 2rem 2rem;
  border-radius: 1rem;
  background-color: var(--color-background-soft);
  transition: background-color 0.5s;
}

.deploy:hover {
  background-color: var(--color-background-mute);
}

.proxy {
  display: flex;
  justify-content: space-between;
}

.info {
  color: var(--color-text-soft);
  display: flex;
}

.info span {
  overflow: hidden;
  text-overflow: ellipsis;
}

.function {
  align-items: center;
}

.function .form-control-sm,
.function .form-select-sm {
  padding-top: 0.1rem;
  padding-bottom: 0.1rem;
  min-height: auto;
}

.function .exec {
  color: var(--color-text);
  opacity: 0.3;
}

.function:hover .exec {
  opacity: 1;
  cursor: pointer;
}

.dropdown-menu {
  max-height: 200px;
  overflow-y: scroll;
}
</style>
