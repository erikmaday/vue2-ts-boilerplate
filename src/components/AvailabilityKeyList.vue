<template>
  <div
    class="padding-r-4 border-gray-mid-light border-r-1 border-l-0 border-y-0 border-solid w-180 max-w-180"
  >
    <div class="h-36 position-relative">
      <v-select
        class="position-absolute vehicles-list-select"
        hide-details
        dense
        height="30px"
        solo
        flat
        :value="isVehicleDisplay"
        @input="(e) => $emit('input:vehicle-display-select', e)"
        label="Vehicles"
        :items="[
          {
            text: 'Vehicles',
            value: true,
          },
          {
            text: 'Drivers',
            value: false,
          },
        ]"
        append-icon="mdi-chevron-down"
      />
    </div>
    <template v-if="isVehicleDisplay">
      <template v-for="(row, index) in vehicleRows">
        <div
          class="font-14 d-flex flex-row align-center"
          :style="`height: ${row.rowHeight}px`"
          :key="`${index}-vehicle-block`"
        >
          <div class="d-flex align-center">
            <img
              :src="
                getImageSrc(
                  row.vehicle.imagePath,
                  'https://www.nationalbuscharter.com/employee/upload/cityBanner/1593699841national-atlanta-charter-bus.jpg'
                )
              "
              width="32"
              height="32"
              class="border-radius-round border-gray-border border-solid border-2 margin-r-1"
            />
          </div>
          <div>
            <p class="margin-a-0 overflow-hidden text-overflow-ellipsis">
              {{ row.vehicle.vehicleName }}
            </p>
            <p
              v-if="row.vehicle.vehicleTypeName"
              class="margin-a-0 font-12 text-gray-light overflow-hidden text-overflow-ellipsis"
            >
              {{ row.vehicle.vehicleTypeName }}
            </p>
          </div>
        </div>
      </template>
    </template>
    <template v-else>
      <template v-for="(row, index) in driverRows">
        <div
          class="font-14 d-flex flex-row align-center"
          :style="`height: ${row.rowHeight}px`"
          :key="`${index}-driver-block`"
        >
          <div class="d-flex align-center">
            <img
              :src="
                getImageSrc(
                  row.driver.imagePath,
                  'https://www.gravatar.com/avatar/35781abe4b5920be6df45021ced0bf7e?s=256&d=mm'
                )
              "
              width="32"
              height="32"
              class="border-radius-round border-gray-border border-solid border-2 margin-r-1"
            />
          </div>
          <div>
            <p class="margin-a-0 overflow-hidden text-overflow-ellipsis">
              {{ `${row.driver.firstName} ${row.driver.lastName}` }}
            </p>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>
<script lang="ts">
import { DriverKeyRow, VehicleKeyRow } from '@/models/dto/Availability'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { baseUrl } from '@/utils/env'
@Component({})
export default class AvailabilityKeyList extends Vue {
  baseUrl = baseUrl

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
    type: Boolean,
  })
  isVehicleDisplay!: boolean

  getImageSrc(imagePath: string | undefined, defaultImage: string): string {
    if (imagePath) {
      return `https://${baseUrl()}${imagePath}`
    } else {
      return defaultImage
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .vehicles-list-select {
  height: 30px;
  max-height: 30px;

  .v-input__slot {
    min-height: 30px !important;
    max-height: 30px;
  }
}
</style>
