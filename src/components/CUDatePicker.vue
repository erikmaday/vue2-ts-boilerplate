<template>
  <v-menu bottom offset-y>
    <template #activator="{ on }">
      <CUTextField
        readonly
        :dense="dense"
        placeholder="MM/DD/YYYY"
        v-on="on"
        :value="textFieldDisplayDate"
        v-bind="$attrs"
      />
    </template>
    <v-date-picker :value="value" @input="$emit('input', $event)" />
  </v-menu>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import dayjs from 'dayjs'

@Component({})
export default class CUDatePicker extends Vue {
  @Prop({
    required: false,
    default: dayjs().format('YYYY-MM-DD'),
    type: String,
  })
  value!: string
  @Prop({
    required: false,
    default: false,
    type: Boolean,
  })
  dense!: boolean

  get textFieldDisplayDate(): string {
    return dayjs(this.value).format('MM/DD/YYYY')
  }
}
</script>
