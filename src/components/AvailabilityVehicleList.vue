<template>
  <div>
    <!-- Spacer -->
    <div class="h-36"></div>
    <template v-for="(row, index) in vehicleRows">
      <div
        class="
          border-y-1 border-x-0 border-solid border-gray-border
          font-14
          d-flex
          flex-row
          align-center
        "
        :style="`height: ${row.rowHeight}px`"
        :key="`${index}-vehicle-block`"
      >
        <div class="d-flex align-center">
          <img
            :src="row.vehicle.imagePath || 'https://www.nationalbuscharter.com/employee/upload/cityBanner/1593699841national-atlanta-charter-bus.jpg'"
            width="32"
            height="32"
            class="border-radius-round border-gray-border border-solid border-2 margin-r-1"
          />
        </div>
        <div>
          <p class="margin-a-0">
            {{ row.vehicle.vehicleName }}
          </p>
          <p v-if="row.vehicle.vehicleTypeName" class="margin-a-0 font-12 text-gray-light">
            {{ row.vehicle.vehicleTypeName }}
          </p>
        </div>
      </div>
    </template>
  </div>
</template>
<script lang="ts">
import { VehicleKeyRow } from '@/models/dto/Availability'
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({})
export default class AvailabilityVehicleList extends Vue {
  @Prop({
    required: true,
    type: Array,
  })
  vehicleRows!: VehicleKeyRow[]
}
</script>
