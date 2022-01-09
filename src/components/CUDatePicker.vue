<template>
  <div>
    <v-menu bottom offset-y>
      <template #activator="{ on }">
        <CUTextField
          readonly
          hide-details
          dense
          placeholder="MM/DD/YYYY"
          v-on="on"
          :value="value"
        />
      </template>
      <v-date-picker :value="computedISODate" @input="updateSelectedDate" />
    </v-menu>
  </div>
</template>
<script lang="ts">
import { Vue, Component, ModelSync, Prop } from 'vue-property-decorator'
import dayjs from 'dayjs'

@Component({})
export default class CUDatePicker extends Vue {
  @Prop({
    required: false, 
    default: dayjs().format('YYYY-MM-DD'), 
    type: String
  })
  value!: string

  get computedISODate(): string {
    return dayjs(this.value, 'MM/DD/YYYY').format('YYYY-MM-DD')
  }

  updateSelectedDate(e) {
    this.$emit('input', dayjs(e).format('MM/DD/YYYY'))
  }
}
</script>
