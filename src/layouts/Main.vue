<template>
  <v-container fluid class="padding-a-8 fill-height w-full align-start">
    <slot />
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class Main extends Vue {}
</script>
