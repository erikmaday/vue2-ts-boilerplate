<template>
  <v-container
    fluid
    class="padding-a-8 fill-height align-start"
    :style="styles"
  >
    <div class="w-full">
      <slot />
    </div>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Inject } from 'vue-property-decorator'

@Component
export default class Main extends Vue {
  @Inject({ from: 'isInMainWithSidebar', default: false })
  readonly isInMainWithSidebar: boolean

  get styles(): Record<string, string> {
    let styles = {
      'max-width': `${this.$vuetify.breakpoint.thresholds.md}px`,
    }
    if (this.isInMainWithSidebar) {
      styles['padding'] = '6px !important'
    }
    return styles
  }
}
</script>
