<template>
  <div>
    <v-row>
      <v-col class="grow">
        <h1>{{ headerText }}</h1>
      </v-col>
      <v-spacer />
      <div class="d-flex shrink padding-a-3">
        <v-btn
          v-if="vehicleDetail.getIsModeAdd || vehicleDetail.getIsModeEdit"
          color="primary"
          small
          text
          class="margin-r-3"
          :key="`cancel-button-${vehicleDetail.getSaving}`"
          :loading="vehicleDetail.getSaving"
          @click="vehicleDetail.goBack"
        >
          Cancel
        </v-btn>
        <v-btn
          v-if="vehicleDetail.getIsModeView"
          color="error"
          small
          text
          class="margin-r-3"
          :key="`delete-button-${vehicleDetail.getSaving}`"
          :loading="vehicleDetail.getSaving"
          @click="deleteModalIsOpen = true"
        >
          Delete
        </v-btn>
        <v-btn
          color="primary"
          small
          :outlined="vehicleDetail.getIsModeView"
          :loading="vehicleDetail.getSaving"
          :key="`main-action-button-${vehicleDetail.getSaving}`"
          @click="handleActionClick"
        >
          {{ actionButtonText }}
        </v-btn>
      </div>
    </v-row>
    <v-row>
      <v-col cols="12" md="5">
        <v-form ref="form" v-model="isFormValid">
          <VehicleDetailInformation />
        </v-form>
      </v-col>
      <v-col cols="12" md="7">
        <VehicleDetailImages />
        <v-row>
          <v-col>
            <v-divider />
          </v-col>
        </v-row>
        <VehicleDetailAmenities />
      </v-col>
    </v-row>
    <CUModal v-model="deleteModalIsOpen">
      <template #title>Delete Vehicle</template>
      <template #text>Are you sure you want to delete this vehicle?</template>
      <template #actions>
        <v-spacer />
        <v-btn color="primary" small text @click="deleteModalIsOpen = false">
          Cancel
        </v-btn>
        <v-btn color="error" small @click="deleteVehicle">Delete</v-btn>
      </template>
    </CUModal>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import VehicleDetailAmenities from '@/components/VehicleDetailAmenities.vue'
import VehicleDetailInformation from '@/components/VehicleDetailInformation.vue'
import VehicleDetailImages from '@/components/VehicleDetailImages.vue'
import vehicleDetail from '@/store/modules/vehicleDetail'
import vehicle from '@/services/vehicle'
import { AxiosResponse } from 'axios'
import { ApiResult } from '@/models/dto'

@Component({
  components: {
    VehicleDetailAmenities,
    VehicleDetailInformation,
    VehicleDetailImages,
  },
})
export default class VehicleDetail extends Vue {
  vehicleDetail = vehicleDetail
  isFormValid = true
  deleteModalIsOpen = false

  @Watch('$route.name', { immediate: true })
  routeNameChanged(value: string): void {
    vehicleDetail.setRouteName(value)
    const vehicleId = this.$route.params.id
    vehicleDetail.setVehicleId(vehicleId)
    vehicleDetail.load()
  }

  get headerText(): string {
    if (vehicleDetail.getIsModeAdd) {
      return 'Add Vehicle'
    }
    if (vehicleDetail.getIsModeEdit && vehicleDetail.getVehicle) {
      return `Edit ${vehicleDetail.getVehicle?.vehicleName}`
    }
    if (vehicleDetail.getIsModeView && vehicleDetail.getVehicle) {
      return vehicleDetail.getVehicle.vehicleName
    }
    return ''
  }

  get actionButtonText(): string {
    return vehicleDetail.getIsModeView ? 'Edit Vehicle' : 'Save'
  }

  async handleActionClick(): Promise<void> {
    vehicleDetail.setSaving(true)
    if (vehicleDetail.getIsModeView) {
      vehicleDetail.beginEdit()
    } else if (this.validate()) {
      if (vehicleDetail.getIsModeEdit) {
        await vehicleDetail.updateVehicle()
      } else if (vehicleDetail.getIsModeAdd) {
        await vehicleDetail.addVehicle()
      }
    }
    vehicleDetail.setSaving(false)
  }

  async deleteVehicle(): Promise<void> {
    if (!vehicleDetail.getVehicleId) {
      return
    }

    const res: AxiosResponse = await vehicle.delete(vehicleDetail.getVehicleId)
    if (res.status === 200) {
      this.deleteModalIsOpen = false
      this.$router.push({ name: 'vehicles' })
    }
  }

  validate(): boolean {
    return (this.$refs.form as any).validate()
  }
}
</script>
