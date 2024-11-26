<script setup lang="ts">
// Properties
interface propsInterface {
  title: string
}
const props = defineProps<propsInterface>()
</script>

<template>
  <div class="greetings">
    <h1 class="green mb-3">
      {{ title }}
    </h1>
    <h2 class="mb-4">Helping developers with smart contract evolution</h2>
    <h3 class="d-none d-lg-block">
      This Digital Twin-based framework can help you to monitor, analyze, update, and evolve smart
      contracts, just like a coach.
    </h3>
  </div>
</template>

<style scoped>
h1 {
  font-size: 3.6rem;
  font-weight: 600;
  line-height: 1;
  position: relative;
}

h2 {
  font-size: 1.8rem;
}

h3 {
  font-size: 1.125rem;
  font-weight: normal;
}

.greetings h1,
.greetings h2,
.greetings h3 {
  text-align: center;
}

@media (min-width: 992px) {
  .greetings h1,
  .greetings h2,
  .greetings h3 {
    text-align: left;
  }
}
</style>
