<template>
  <v-dialog
    v-model="isDialogOpen"
    :fullscreen="$vuetify.breakpoint.xs"
    :width="width"
    :max-width="maxWidth"
  >
    <v-card>
      <v-card-title class="background-primary text-white font-medium">
        <slot name="title" />
      </v-card-title>
      <v-card-text>
        <slot name="text" />
      </v-card-text>
      <v-card-actions>
        <slot name="actions" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Model, Prop, Watch, Vue, Component } from 'vue-property-decorator'

@Component
export default class CUModal extends Vue {
  @Model('input') readonly value!: boolean | null
  @Prop({
    type: String,
    required: false,
    default: '500px',
  })
  width!: string
  @Prop({
    type: String,
    required: false,
    default: '500px',
  })
  maxWidth!: string
  @Watch('isDialogOpen')
  isDialogOpenChanged(value: boolean): void {
    this.$emit('input', value)
  }
  @Watch('value')
  valueChanged(value: boolean): void {
    this.isDialogOpen = value
  }

  isDialogOpen = false
}
</script>
