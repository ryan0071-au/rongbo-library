<template>
  <div class="app-shell">
    <header v-if="showHeader">
      <div class="container py-3">
        <BHeader />
      </div>
    </header>

    <main class="container py-4">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import BHeader from './components/BHeader.vue'

const route = useRoute()
const showHeader = computed(() => route.name !== 'CountBookAPI')
</script>

<style>
.app-shell {
  min-height: 100vh;
  background: #f8f9fa;
}

.section + .section {
  margin-top: 1.5rem;
}
</style>
