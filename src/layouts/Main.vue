<template>
  <v-container
    fluid
    class="pa-8 fill-height align-start"
    :style="{ 'max-width': `${$vuetify.breakpoint.thresholds.md}px` }"
  >
    <slot />
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component()
export default class Main extends Vue {}
</script>
