<template>
  <v-row v-if="!isMobile">
    <v-btn x-small icon @click="$emit(cancelEventName, rowIndex)">
      <CUIcon color="error">close</CUIcon>
    </v-btn>
    <v-btn x-small icon @click="$emit(eventName, row)">
      <CUIcon color="success">done</CUIcon>
    </v-btn>
  </v-row>
  <v-col v-else>
    <v-btn
      x-small
      class="w-full margin-t-4"
      color="error"
      @click="$emit(cancelEventName, rowIndex)"
    >
      <CUIcon>close</CUIcon>
      Close
    </v-btn>
    <v-btn
      x-small
      color="success"
      class="w-full margin-t-4"
      @click="$emit(eventName, row)"
    >
      <CUIcon>done</CUIcon>
      Save
    </v-btn>
  </v-col>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({})
export default class CUDataTableRowEditActions extends Vue {
  @Prop({
    required: true,
    type: String,
  })
  eventName!: string

  @Prop({
    required: true,
    type: Boolean,
  })
  isMobile!: boolean

  @Prop({
    required: true,
  })
  row!: any

  @Prop({
    required: true, 
    type: Number
  })
  rowIndex!: number

  get cancelEventName(): string {
    return `cancel-${this.eventName}`
  }
}
</script>
