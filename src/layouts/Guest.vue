<template>
  <div class="h-full">
    <TheAppBar />
    <slot />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import TheAppBar from '@/components/TheAppBar.vue'

@Component({ components: { TheAppBar } })
export default class Guest extends Vue {}
</script>