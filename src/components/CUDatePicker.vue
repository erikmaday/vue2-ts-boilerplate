<template>
  <div>
    <v-menu bottom offset-y>
      <template #activator="{ on }">
        <CUTextField
          readonly
          hide-details
          dense
          placeholder="MM-DD-YYYY"
          v-on="on"
          :value="selectedDate"
        />
      </template>
      <v-date-picker @input="updateSelectedDate" />
    </v-menu>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({})
export default class CUDatePicker extends Vue {
  selectedDate = '2022-01-06'

  updateSelectedDate(e) {
    console.log("> e:", e)
    this.selectedDate = e
  }
}
</script>
