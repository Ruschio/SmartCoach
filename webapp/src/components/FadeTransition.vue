<script setup lang="ts"></script>

<template>
  <Transition name="fade" mode="out-in">
    <slot></slot>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
