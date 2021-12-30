<template>
  <v-row wrap>
    <template v-if="!!vehicleInformation">
      <v-col cols="12" class="padding-t-0">
        <h3>Vehicle Information</h3>
      </v-col>
      <v-col cols="6" class="padding-y-0">
        <CUTextField
          v-model="vehicleInformation.vehicleName"
          :disabled="isModeView"
          label="Vehicle Name"
        />
      </v-col>
      <v-col cols="6" class="padding-y-0">
        <CUSelect
          v-model="vehicleInformation.vehicleTypeId"
          :disabled="isModeView"
          label="Vehicle Type"
          :items="vehicleTypes"
          item-text="label"
          item-value="id"
        />
      </v-col>
      <v-col cols="6" class="padding-y-0">
        <CUTextField
          v-model="vehicleInformation.vehicleMake"
          :disabled="isModeView"
          label="Vehicle Make"
        />
      </v-col>
      <v-col cols="6" class="padding-y-0">
        <CUTextField
          v-model="vehicleInformation.vehicleModel"
          :disabled="isModeView"
          label="Vehicle Model"
        />
      </v-col>
      <v-col cols="6" class="padding-y-0">
        <CUTextField
          v-model="vehicleInformation.vehicleYear"
          :disabled="isModeView"
          label="Vehicle Year"
        />
      </v-col>
      <v-col cols="6" class="padding-y-0">
        <CUTextField
          v-model="vehicleInformation.passengerCapacity"
          :disabled="isModeView"
          label="Capacity"
        />
      </v-col>
      <v-col cols="6" class="padding-y-0">
        <CUTextField
          v-model="vehicleInformation.vinNumber"
          :disabled="isModeView"
          label="VIN #"
        />
      </v-col>
      <v-col cols="6" class="padding-y-0">
        <CUTextField
          v-model="vehicleInformation.licensePlate"
          :disabled="isModeView"
          label="License Plate"
        />
      </v-col>
      <v-col cols="6" class="padding-y-0">
        <CUSelect
          v-model="vehicleInformation.garageId"
          :disabled="isModeView"
          label="Garage"
          :items="garages"
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
import { Vue, Component, Model, Watch, Prop } from 'vue-property-decorator'

@Component
export default class VehicleDetailInformation extends Vue {
  @Model('change') readonly vehicle!: VehicleDetailEntity
  @Prop({ required: true, type: Boolean }) readonly isModeView!: boolean

  garages: Garage[] | null = []
  vehicleTypes: VehicleType[] | null = []

  vehicleInformation: VehicleDetailEntity | null = null

  @Watch('vehicleInformation', { deep: true })
  vehicleChanged(value: VehicleDetailEntity[]): void {
    this.$emit('change', value)
  }

  @Watch('vehicle', { deep: true, immediate: true })
  parentVehicleChanged(value: VehicleDetailEntity[]): void {
    this.vehicleInformation = value
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
