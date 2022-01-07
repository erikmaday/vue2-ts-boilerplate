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
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import VehicleDetailAmenities from '@/components/VehicleDetailAmenities.vue'
import VehicleDetailInformation from '@/components/VehicleDetailInformation.vue'
import VehicleDetailImages from '@/components/VehicleDetailImages.vue'
import vehicleDetail from '@/store/modules/vehicleDetail'

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

  validate(): boolean {
    return (this.$refs.form as any).validate()
  }
}
</script>
