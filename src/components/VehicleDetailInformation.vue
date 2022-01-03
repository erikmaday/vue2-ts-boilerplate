<template>
  <v-row wrap>
    <template v-if="!!vehicleInformation">
      <v-col cols="12" class="padding-t-0">
        <h3>Vehicle Information</h3>
      </v-col>
      <v-col cols="6" class="padding-y-0">
        <CUTextField
          v-model="vehicleInformation.vehicleName"
          :disabled="disabled"
          :rules="[(v) => !!v || 'Vehicle name is required']"
          label="Vehicle Name"
        />
      </v-col>
      <v-col cols="6" class="padding-y-0">
        <CUSelect
          v-model="vehicleInformation.vehicleTypeId"
          :disabled="disabled"
          label="Vehicle Type"
          :items="vehicleTypes"
          :rules="[(v) => !!v || 'Vehicle type is required']"
          item-text="label"
          item-value="id"
        />
      </v-col>
      <v-col cols="6" class="padding-y-0">
        <CUTextField
          v-model="vehicleInformation.vehicleMake"
          :disabled="disabled"
          :rules="[(v) => !!v || 'Vehicle make is required']"
          label="Vehicle Make"
        />
      </v-col>
      <v-col cols="6" class="padding-y-0">
        <CUTextField
          v-model="vehicleInformation.vehicleModel"
          :disabled="disabled"
          :rules="[(v) => !!v || 'Vehicle model is required']"
          label="Vehicle Model"
        />
      </v-col>
      <v-col cols="6" class="padding-y-0">
        <CUTextField
          v-model="vehicleInformation.vehicleYear"
          :disabled="disabled"
          :rules="[(v) => !!v || 'Vehicle year is required']"
          label="Vehicle Year"
        />
      </v-col>
      <v-col cols="6" class="padding-y-0">
        <CUTextField
          v-model="vehicleInformation.passengerCapacity"
          :disabled="disabled"
          :rules="[(v) => !!v || 'Passenger capacity is required']"
          label="Capacity"
        />
      </v-col>
      <v-col cols="6" class="padding-y-0">
        <CUTextField
          v-model="vehicleInformation.vinNumber"
          :disabled="disabled"
          :rules="[(v) => !!v || 'VIN # is required']"
          label="VIN #"
        />
      </v-col>
      <v-col cols="6" class="padding-y-0">
        <CUTextField
          v-model="vehicleInformation.licensePlate"
          :disabled="disabled"
          :rules="[(v) => !!v || 'License plate is required']"
          label="License Plate"
        />
      </v-col>
      <v-col cols="6" class="padding-y-0">
        <CUSelect
          v-model="vehicleInformation.garageId"
          :disabled="disabled"
          label="Garage"
          :items="garages"
          :rules="[(v) => !!v || 'Garage is required']"
          item-text="garageName"
          item-value="garageId"
        />
      </v-col>
    </template>
  </v-row>
</template>

<script lang="ts">
import { VehicleDetailEntity, VehicleType } from '@/models/dto'
import { Garage } from '@/models/dto/Garage'
import garage from '@/services/garage'
import type from '@/services/type'
import vehicleDetail from '@/store/modules/vehicleDetail'
import { Vue, Component, Watch } from 'vue-property-decorator'

@Component
export default class VehicleDetailInformation extends Vue {
  vehicleInformation: VehicleDetailEntity | null = null
  debounce = null

  @Watch('vehicleInformation', { deep: true })
  vehicleChanged(value: VehicleDetailEntity): void {
    if (this.debounce) {
      window.clearTimeout(this.debounce)
    }
    this.debounce = window.setTimeout(async () => {
      vehicleDetail.setVehicle(value)
    }, 100)
  }

  @Watch('vehicle', { deep: true, immediate: true })
  parentVehicleChanged(value: VehicleDetailEntity): void {
    this.vehicleInformation = value
  }

  get vehicle(): VehicleDetailEntity {
    return vehicleDetail.getVehicle
  }

  garages: Garage[] | null = []
  vehicleTypes: VehicleType[] | null = []

  vehicleInformation: VehicleDetailEntity | null = null

  get disabled(): boolean {
    return vehicleDetail.getIsModeView
  }

  async mounted(): void {
    this.getVehicleTypes()
    this.getGarages()
  }

  async getGarages(): Promise<void> {
    const garageResponse = await garage.tableView({ pageSize: -1 })
    this.garages = garageResponse.data.resultList
  }

  async getVehicleTypes(): Promise<void> {
    const response = await type.vehicleTypeTableView({ pageSize: -1, page: 1 })
    this.vehicleTypes = response.data.resultList
  }
}
</script>
