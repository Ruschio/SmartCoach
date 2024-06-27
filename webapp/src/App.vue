<script setup lang="ts">
import FadeTransition from '@/components/FadeTransition.vue'
import { initWallet } from '@/services/walletService'
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'

onMounted(() => initWallet())
</script>

<template>
  <RouterView v-slot="{ Component }">
    <FadeTransition>
      <component :is="Component" />
    </FadeTransition>
  </RouterView>
</template>
