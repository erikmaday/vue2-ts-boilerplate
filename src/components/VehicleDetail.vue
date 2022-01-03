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
          :key="`cancel-button-${saving}`"
          :loading="saving"
          @click="handleCancel"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          small
          :outlined="isModeView"
          :loading="saving"
          :key="`main-action-button-${saving}`"
          @click="handleActionClick"
        >
          {{ isModeView ? 'Edit Vehicle' : 'Save' }}
        </v-btn>
      </div>
    </v-row>
    <v-row>
      <v-col cols="12" md="5">
        <v-form ref="form" v-model="isFormValid">
          <VehicleDetailInformation
            v-model="vehicle"
            :is-mode-view="isModeView"
          />
        </v-form>
      </v-col>
      <v-col cols="12" md="7">
        <VehicleDetailImages
          :vehicle-photos="vehicle.vehiclePhotoDTOs"
          :is-mode-edit="isModeEdit"
          :is-mode-view="isModeView"
          :is-mode-add="isModeAdd"
          :upload-percentage="imageUploadStatus.uploadPercentage"
          @remove="deletedPhotos.push({ vehiclePhotoId: $event })"
          @add-photos="addPhotos"
        />
        <v-row>
          <v-col>
            <v-divider />
          </v-col>
        </v-row>
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
import { VehicleDetailEntity, VehiclePhotoDTO } from '@/models/dto'
import app from '@/store/modules/app'
import VehicleDetailAmenities from '@/components/VehicleDetailAmenities.vue'
import VehicleDetailInformation from '@/components/VehicleDetailInformation.vue'
import VehicleDetailImages from '@/components/VehicleDetailImages.vue'
import auth from '@/store/modules/auth'
import deepClone from '@/utils/deepClone'

@Component({
  components: {
    VehicleDetailAmenities,
    VehicleDetailInformation,
    VehicleDetailImages,
  },
})
export default class VehicleDetail extends Vue {
  notFound = false
  saving = false
  isFormValid = true

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

  imageUploadStatus: any = {
    uploadPercentage: 0,
  }

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
    this.imageUploadStatus = {
      uploadPercentage: 0,
    }
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
    // TODO: form validation here for all inputs, on pictures too?
    this.saving = true
    if (this.isModeView) {
      this.beginEdit()
    } else if (this.validate()) {
      if (this.isModeEdit) {
        this.updateVehicle()
      } else if (this.isModeAdd) {
        this.validate()
        this.addVehicle()
      }
    }
    this.saving = false
  }

  beginEdit(): void {
    this.$router.push({
      name: 'vehicles.edit',
      params: { id: this.$route.params.id },
    })
  }

  async updateVehicle(): Promise<void> {
    try {
      const deletedPhotos = this.buildDeletePhotosPayload()
      if (deletedPhotos.vehiclePhotos.length) {
        await vehicle.deletePhotos(this.vehicle.vehicleId, deletedPhotos)
      }
      await vehicle.update(this.vehicle)
      await this.uploadPhotos(this.vehicle.vehicleId)
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
      await this.uploadPhotos(vehicleId)
      this.$router.push({
        name: 'vehicles.view',
        params: { id: vehicleId },
      })
    } catch (e) {
      console.log(e)
    }
  }

  async uploadPhotos(vehicleId: number): Promise<void> {
    const newVehiclePhotos = this.buildNewPhotosPayload()
    if (newVehiclePhotos) {
      await vehicle.uploadPhotos(
        vehicleId,
        newVehiclePhotos,
        this.imageUploadStatus
      )
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

  buildDeletePhotosPayload(): { vehiclePhotos: { vehiclePhotoId: number }[] } {
    const deletedPhotos = this.vehicle?.vehiclePhotoDTOs
      .filter((photo) => !photo.active)
      .map((photo) => {
        return { vehiclePhotoId: photo.vehiclePhotoId }
      })
    return {
      vehiclePhotos: deletedPhotos,
    }
  }

  buildNewPhotosPayload(): FormData | null {
    let count = 0
    const form = new FormData()
    for (const photo of this.vehicle.vehiclePhotoDTOs) {
      if (photo?.file) {
        form.append('files', photo.file)
        count++
      }
    }
    return count ? form : null
  }

  addPhotos(photos: VehiclePhotoDTO[]): void {
    const newPhotosList = deepClone(this.vehicle.vehiclePhotoDTOs)
    for (const photo of photos) {
      newPhotosList.push(photo)
    }
    this.vehicle.vehiclePhotoDTOs = newPhotosList
  }

  validate(): void {
    return this.$refs.form.validate()
  }
}
</script>
