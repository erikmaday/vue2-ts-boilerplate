<template>
  <div>
    <v-row>
      <v-col class="grow">
        <h1>{{ headerText }}</h1>
      </v-col>
      <v-spacer />
      <div class="d-flex shrink padding-a-3">
        <v-btn
          v-if="isModeAdd || isModeEdit"
          color="primary"
          small
          text
          class="margin-r-3"
          @click="handleCancel"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          small
          :outlined="isModeView"
          @click="handleActionClick"
        >
          {{ isModeView ? 'Edit Vehicle' : 'Save' }}
        </v-btn>
      </div>
    </v-row>
    <v-row>
      <v-col cols="12" md="5">
        <VehicleDetailInformation
          v-model="vehicle"
          :is-mode-view="isModeView"
        />
      </v-col>
      <v-col cols="12" md="7">
        <VehicleDetailImages
          :vehicle-photos="vehicle.vehiclePhotoDTOs"
          :is-mode-edit="isModeEdit"
          :is-mode-view="isModeView"
          :is-mode-add="isModeAdd"
          @remove="deletedPhotos.push({ vehiclePhotoId: $event })"
        />
        <VehicleDetailAmenities
          v-model="vehicle.vehicleAmenityDTOs"
          :is-mode-view="isModeView"
          :is-mode-add="isModeAdd"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import vehicle from '@/services/vehicle'
import { AxiosResponse } from 'axios'
import { VehicleDetailEntity } from '@/models/dto'
import { AmenityType } from '@/models/dto/Amenity'
import app from '@/store/modules/app'
import VehicleDetailAmenities from '@/components/VehicleDetailAmenities.vue'
import VehicleDetailInformation from '@/components/VehicleDetailInformation.vue'
import VehicleDetailImages from '@/components/VehicleDetailImages.vue'
import auth from '@/store/modules/auth'

@Component({
  components: {
    VehicleDetailAmenities,
    VehicleDetailInformation,
    VehicleDetailImages,
  },
})
export default class VehicleDetail extends Vue {
  notFound = false

  vehicle: VehicleDetailEntity | null = {
    vehicleId: null,
    vehicleName: null,
    vehicleTypeName: null,
    vehicleTypeId: null,
    vehicleMake: null,
    vehicleModel: null,
    vehicleYear: null,
    passengerCapacity: null,
    vinNumber: null,
    licensePlate: null,
    garageId: null,
    garageName: null,
    companyId: null,
    vehicleAmenityDTOs: [],
    vehiclePhotoDTOs: [],
    active: null,
  }

  deletedPhotos: { vehiclePhotoId: number }[] = []

  get isModeAdd(): boolean {
    return this.$route.name === 'vehicles.add'
  }
  get isModeEdit(): boolean {
    return this.$route.name === 'vehicles.edit'
  }
  get isModeView(): boolean {
    return this.$route.name === 'vehicles.view'
  }

  get headerText(): string {
    if (this.isModeAdd) {
      return 'Add Vehicle'
    }
    if (this.isModeEdit && this.vehicle) {
      return `Edit ${this.vehicle?.vehicleName}`
    }
    if (this.isModeView && this.vehicle) {
      return this.vehicle.vehicleName
    }
    return ''
  }

  mounted(): void {
    this.load()
  }

  async load(): Promise<void> {
    if (this.isModeAdd) {
      this.vehicle.active = true
      this.vehicle.companyId = auth.getUser?.companyId
    } else {
      await this.getVehicle()
    }
  }

  async getVehicle(): Promise<void> {
    let response: AxiosResponse
    try {
      if (this.$route.params.id) {
        response = await vehicle.byId(Number(this.$route.params.id))
        this.vehicle = this.processVehicle(response.data)
      } else {
        this.notFound = true
        return
      }
    } catch (e) {
      this.notFound = true
      console.error(e)
      return
    }
  }

  processVehicle(vehicle: VehicleDetailEntity): VehicleDetailEntity {
    vehicle.vehicleTypeId = parseInt(vehicle.vehicleTypeId)
    vehicle.vehicleAmenityDTOs = vehicle.vehicleAmenityDTOs.sort(
      (a, b) => a.amenityId - b.amenityId
    )
    return vehicle
  }

  async handleActionClick(): void {
    if (this.isModeView) {
      this.beginEdit()
      return
    }
    if (this.isModeEdit) {
      this.updateVehicle()
      return
    }
    if (this.isModeAdd) {
      this.addVehicle()
      return
    }
  }

  beginEdit(): void {
    this.$router.push({
      name: 'vehicles.edit',
      params: { id: this.$route.params.id },
    })
  }

  async updateVehicle(): Promise<void> {
    try {
      await vehicle.deletePhotos(this.vehicle.vehicleId, {
        vehiclePhotos: this.deletedPhotos,
      })
      await vehicle.update(this.vehicle)
      this.load()
      this.$router.push({
        name: 'vehicles.view',
        params: { id: this.$route.params.id },
      })
    } catch (e) {
      console.log(e)
    }
  }

  async addVehicle(): Promise<void> {
    try {
      const vehicleResponse = await vehicle.create(this.vehicle)
      const vehicleId = vehicleResponse.data
      this.$router.push({
        name: 'vehicles.view',
        params: { id: vehicleId },
      })
    } catch (e) {
      console.log(e)
    }
  }

  handleCancel(): void {
    if (this.isModeAdd) {
      this.goBack()
    } else {
      this.cancel()
    }
    this.load()
  }

  cancel(): void {
    this.$router.push({
      name: 'vehicles.view',
      params: { id: this.$route.params.id },
    })
  }

  goBack(): void {
    this.$router.push(app.getLastRoute)
  }
}
</script>
