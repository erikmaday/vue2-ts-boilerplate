<template>
  <div class="position-absolute h-full w-full z-4" style="pointer-events: none">
    <div
      style="height: 37px"
      class="
        top-bar
        border-b-1 border-x-0 border-t-0 border-gray-mid-light border-solid
      "
    ></div>
    <template v-if="isVehicleDisplay">
      <div
        v-for="(block, index) in vehicleRows"
        :key="`grid-block-${index}`"
        class="
          border-x-0 border-t-0 border-b-1 border-gray-mid-light border-solid
        "
        :style="`height: ${block.rowHeight}px;`"
      ></div>
    </template>
    <template v-else>
      <div
        v-for="(block, index) in driverRows"
        :key="`grid-block-${index}`"
        class="
          border-x-0 border-t-0 border-b-1 border-gray-mid-light border-solid
        "
        :style="`height: ${block.rowHeight}px;`"
      ></div>
    </template>
  </div>
</template>
<script lang="ts">
import { DriverKeyRow, VehicleKeyRow } from '@/models/dto/Availability'
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({})
export default class AvailabilityGridLines extends Vue {
  @Prop({
    required: true,
    type: Array,
  })
  vehicleRows!: VehicleKeyRow[]

  @Prop({
    required: true,
    type: Array,
  })
  driverRows!: DriverKeyRow[]

  @Prop({
    required: true, 
    type: Boolean
  })
  isVehicleDisplay!: boolean
}
</script>
<style lang="scss" scoped>

</style>
