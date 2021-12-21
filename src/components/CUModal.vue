<template>
  <v-dialog
    v-model="isDialogOpen"
    :fullscreen="$vuetify.breakpoint.xs"
    width="500px"
    max-width="500px"
  >
    <v-card>
      <v-card-title class="background-primary text-white font-medium">
        <slot name="title"></slot>
      </v-card-title>
      <v-card-text>
        <slot name="text"></slot>
      </v-card-text>
      <v-card-actions>
        <slot name="buttons"></slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Prop, Vue, Component } from 'vue-property-decorator'

@Component
export default class CUModal extends Vue {
  @Prop({
    type: Boolean,
    required: false,
    default: false,
  })
  isDialogOpen!: boolean
}
</script>
