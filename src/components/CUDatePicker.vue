<template >
  <v-menu bottom offset-y>
    <template #activator="{ on }">
      <label class="font-14" v-if="$attrs.label">{{ $attrs.label }}</label>
      <CUTextField
        readonly
        hide-details
        :dense="dense"
        placeholder="MM/DD/YYYY"
        v-on="on"
        :value="value"
      />
    </template>
    <v-date-picker :value="computedISODate" @input="updateSelectedDate" />
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

  get computedISODate(): string {
    return dayjs(this.value).format('YYYY-MM-DD')
  }

  updateSelectedDate(e): void {
    this.$emit('input', dayjs(e).format('MM/DD/YYYY'))
  }
}
</script>
