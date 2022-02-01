<template>
  <Detail>
    <template #back>
      <CUSkeletonLoader
        v-if="showLoaders"
        type="icon"
        :width="$vuetify.breakpoint.xs ? '61px' : undefined"
        class="margin-y-2"
        :class="{
          'margin-x-auto': $vuetify.breakpoint.xs,
          'margin-l-1 margin-r-2': $vuetify.breakpoint.smAndUp,
        }"
      />
      <router-link v-else :to="vehicleDetail.getLastRoute">
        <v-btn
          :icon="$vuetify.breakpoint.mdAndUp"
          :x-small="$vuetify.breakpoint.mdAndUp"
          :small="$vuetify.breakpoint.smAndDown"
          plain
          color="primary"
        >
          <CUIcon>arrow_left</CUIcon>
          <span v-if="$vuetify.breakpoint.xs" class="margin-l-1">Back</span>
        </v-btn>
      </router-link>
    </template>
    <template #title>
      <h1 class="margin-b-0">{{ headerTitle }}</h1>
    </template>
    <template #buttons>
      <template
        v-if="vehicleDetail.getIsModeAdd || vehicleDetail.getIsModeEdit"
      >
        <CUSkeletonLoader
          v-if="showLoaders"
          :type="$vuetify.breakpoint.xs ? 'button' : 'text'"
          :width="$vuetify.breakpoint.xs ? '100%' : '48px'"
          :class="{
            'w-full margin-y-2': $vuetify.breakpoint.xs,
            'margin-l-8 margin-r-4': $vuetify.breakpoint.smAndUp,
          }"
        />
        <v-btn
          v-else
          color="primary"
          small
          :text="$vuetify.breakpoint.mdAndUp"
          :outlined="$vuetify.breakpoint.smAndDown"
          :class="{
            'w-full margin-y-2': $vuetify.breakpoint.xs,
            'margin-l-4': $vuetify.breakpoint.smAndUp,
          }"
          :key="`cancel-button-${vehicleDetail.getSaving}`"
          :loading="vehicleDetail.getSaving"
          @click="vehicleDetail.goBack"
        >
          Cancel
        </v-btn>
      </template>
      <template v-if="vehicleDetail.getIsModeView">
        <CUSkeletonLoader
          v-if="showLoaders"
          :type="$vuetify.breakpoint.xs ? 'button' : 'text'"
          :width="$vuetify.breakpoint.xs ? '100%' : '47px'"
          :class="{
            'w-full margin-y-2': $vuetify.breakpoint.xs,
            'margin-l-8 margin-r-4': $vuetify.breakpoint.smAndUp,
          }"
        />
        <v-btn
          v-else-if="vehicleDetail.getIsModeView"
          color="error"
          small
          :text="$vuetify.breakpoint.mdAndUp"
          :outlined="$vuetify.breakpoint.smAndDown"
          :class="{
            'w-full margin-y-2': $vuetify.breakpoint.xs,
            'margin-l-4': $vuetify.breakpoint.smAndUp,
          }"
          :key="`delete-button-${vehicleDetail.getSaving}`"
          :loading="vehicleDetail.getSaving"
          @click="deleteModalIsOpen = true"
        >
          Delete
        </v-btn>

        <CUSkeletonLoader
          v-if="showLoaders"
          type="button"
          :width="$vuetify.breakpoint.xs ? '100%' : '118px'"
          :class="{
            'w-full margin-y-2': $vuetify.breakpoint.xs,
            'margin-l-4': $vuetify.breakpoint.smAndUp,
          }"
        />
        <v-btn
          v-else-if="vehicleDetail.getIsModeView"
          color="primary"
          small
          outlined
          :class="{
            'w-full margin-y-2': $vuetify.breakpoint.xs,
            'margin-l-4': $vuetify.breakpoint.smAndUp,
          }"
          :loading="vehicleDetail.getSaving"
          :key="`edit-action-button-${vehicleDetail.getSaving}`"
          @click="handleActionClick"
        >
          Edit Vehicle
        </v-btn>
      </template>
      <template v-if="!vehicleDetail.getIsModeView">
        <CUSkeletonLoader
          v-if="showLoaders"
          type="button"
          :width="$vuetify.breakpoint.xs ? '100%' : '71px'"
          :class="{
            'w-full margin-y-2': $vuetify.breakpoint.xs,
            'margin-l-4': $vuetify.breakpoint.smAndUp,
          }"
        />
        <v-btn
          v-else-if="!vehicleDetail.getIsModeView"
          color="primary"
          small
          :class="{
            'w-full margin-y-2': $vuetify.breakpoint.xs,
            'margin-l-4': $vuetify.breakpoint.smAndUp,
          }"
          :loading="vehicleDetail.getSaving"
          :key="`save-action-button-${vehicleDetail.getSaving}`"
          @click="handleActionClick"
        >
          Save
        </v-btn>
      </template>
    </template>
    <v-switch v-model="loading" />
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
  </Detail>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import Detail from '@/layouts/Detail.vue'
import VehicleDetailAmenities from '@/components/VehicleDetailAmenities.vue'
import VehicleDetailInformation from '@/components/VehicleDetailInformation.vue'
import VehicleDetailImages from '@/components/VehicleDetailImages.vue'
import vehicleDetail from '@/store/modules/vehicleDetail'
import vehicle from '@/services/vehicle'
import { AxiosResponse } from 'axios'

@Component({
  components: {
    Detail,
    VehicleDetailAmenities,
    VehicleDetailInformation,
    VehicleDetailImages,
  },
})
export default class VehicleDetail extends Vue {
  vehicleDetail = vehicleDetail
  isFormValid = true
  deleteModalIsOpen = false
  loading = false

  @Watch('loading')
  loadingChanged(value: boolean): void {
    vehicleDetail.setLoading(value)
  }

  @Watch('vehicleDetail.getShowLoaders')
  getShowLoadersChanged(value: boolean): void {
    this.loading = value
  }

  @Watch('$route.name', { immediate: true })
  routeNameChanged(value: string): void {
    vehicleDetail.setRouteName(value)
    const vehicleId = this.$route.params.id
    vehicleDetail.setVehicleId(vehicleId)
    vehicleDetail.load()
  }

  get showLoaders(): boolean {
    return vehicleDetail.getShowLoaders
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
