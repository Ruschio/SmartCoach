<script setup lang="ts">
import type { MyContract } from '@/models/MyContract'
import type { IMyTransaction } from '@/models/MyTransaction'
import { useContractStore } from '@/stores/contract'
import { ethers } from 'ethers'
import { ref } from 'vue'

// Properties
interface propsInterface {
  contract: MyContract
}
const props = defineProps<propsInterface>()

// Data
const { getContract, getContractTxs } = useContractStore()
const filter = ref<string>()

// Methods
const parseTransaction = (tx: IMyTransaction) =>
  new ethers.Interface(getContract(props.contract.getId())?.abi || []).parseTransaction({
    data: tx.input,
    value: tx.value
  })
</script>

<template>
  <div id="transactionList">
    <div v-if="getContract(contract.getId())?.loading" class="transaction">
      <span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
      Loading transactions
    </div>
    <template v-else>
      <input
        type="text"
        v-model="filter"
        class="form-control form-control-lg"
        placeholder="Search and filter transactions"
      />
      <div v-if="!getContractTxs(contract.getId())" class="transaction">
        No recorded transactions
      </div>
      <div
        v-else
        v-for="([hash, tx], i) in Array.from(getContractTxs(contract.getId()) || []).slice(0, 10)"
        class="transaction"
        :key="hash"
      >
        <small>#{{ i + 1 }}</small>
        <div><b>From: </b>{{ tx.from }}</div>
        <div><b>Function: </b>{{ tx.functionName }}</div>
        <div><b>Input: </b>{{ parseTransaction(tx)?.signature ?? 'Undecoded' }}</div>
        <div><b>Value: </b>{{ tx.value }}</div>
      </div>
    </template>
  </div>
</template>

<style scoped>
#transactionList {
  padding: 0;
  display: flex;
  flex-flow: column;
  gap: 1rem;
}

#transactionList .transaction {
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  color: var(--color-text);
  background-color: var(--color-background-mute);
  overflow: hidden;
}
</style>
