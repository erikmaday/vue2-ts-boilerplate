<template>
  <Detail>
    <template #back>
      <router-link :to="lastRoute">
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
    <template #title>{{ headerTitle }}</template>
    <template #buttons>
      <v-btn
        v-show="isModeEdit || isModeAdd"
        :class="{
          'w-full margin-y-2': $vuetify.breakpoint.xs,
          'margin-l-4': $vuetify.breakpoint.smAndUp,
        }"
        :text="$vuetify.breakpoint.mdAndUp"
        :outlined="$vuetify.breakpoint.smAndDown"
        small
        color="primary"
        @click="handleCancel"
      >
        Cancel
      </v-btn>
      <v-btn
        :class="{
          'w-full margin-y-2': $vuetify.breakpoint.xs,
          'margin-l-4': $vuetify.breakpoint.smAndUp,
        }"
        v-show="isModeView"
        primary
        :text="$vuetify.breakpoint.mdAndUp"
        :outlined="$vuetify.breakpoint.smAndDown"
        small
        color="error"
        @click="isDeleteModalOpen = true"
      >
        Delete
      </v-btn>
      <v-btn
        v-show="isModeView"
        :class="{
          'w-full margin-y-2': $vuetify.breakpoint.xs,
          'margin-l-4': $vuetify.breakpoint.smAndUp,
        }"
        small
        outlined
        color="primary"
        @click="
          $router.push({
            name: 'rates.adjustments.edit',
            params: { id: $route.params.id },
          })
        "
      >
        Edit Adjustment
      </v-btn>
      <v-btn
        v-show="!isModeView"
        :class="{
          'w-full margin-y-2': $vuetify.breakpoint.xs,
          'margin-l-4': $vuetify.breakpoint.smAndUp,
        }"
        small
        color="primary"
        @click="submit"
      >
        Save
      </v-btn>
    </template>
    <v-form :disabled="isModeView" ref="form" lazy-validation>
      <v-row>
        <v-col cols="12" sm="6" class="py-0">
          <CUTextField
            label="Markup Name"
            placeholder="Weekend Prices"
            :rules="[(val) => !!val || 'Markup Name is Required']"
            v-model="currentMarkup.name"
          />
        </v-col>
        <v-col cols="12" sm="6" class="py-0">
          <CUTextField
            label="Markup %"
            placeholder="10"
            :rules="[(val) => !!val || 'Markup % is Required']"
            v-model="currentMarkup.markupPercentage"
          />
        </v-col>
      </v-row>
      <v-row wrap :class="{ 'pb-4': !vehicleTypeError }">
        <v-col cols="12" class="py-0">
          <label class="font-14">Vehicle Type</label>
        </v-col>
        <v-row
          wrap
          class="mx-3"
          :class="{
            'border-solid border-2 border-error border-radius-regular background-error-background my-0':
              vehicleTypeError,
            'pt-3': !vehicleTypeError,
          }"
        >
          <v-col
            v-for="([key, type], vti) in Object.entries(vehicleTypeMap)"
            :key="`vehicle-type-${key}-${vti}`"
            cols="6"
            sm="4"
          >
            <v-checkbox
              class="padding-a-0 margin-a-0"
              :disabled="!isModeAdd"
              hide-details
              :value="vehicleTypeMap[key].supported"
              :label="type.label"
              @change="(e) => updateVehicleTypes(Number(key), e || false)"
            />
          </v-col>
        </v-row>
        <span
          v-show="vehicleTypeError"
          class="text-error font-medium font-12 pl-6 mb-2"
        >
          At Least One Vehicle Type is Required
        </span>
      </v-row>
      <v-row>
        <v-col cols="12" sm="6" class="py-0">
          <CUSelect
            v-model="newRateTypes"
            :items="marketRateTypes"
            :multiple="true"
            :rules="[(val) => isNotEmptyArray(val) || 'Type is required']"
            :disabled="!isModeAdd"
            item-text="label"
            item-value="key"
            label="Rate Type"
            placeholder="Select Rate Type"
          />
        </v-col>
        <v-col cols="12" sm="6" class="py-0">
          <CUSelect
            v-model="newMarkupDays"
            :items="markupDays"
            :multiple="true"
            :rules="[(val) => isNotEmptyArray(val) || 'Day is required']"
            item-text="description"
            item-value="val"
            label="Day"
            placeholder="Select Day"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="6" class="py-0">
          <CUDatePicker
            v-model="newStartDate"
            label="Start Date"
            class="error"
            :rules="[
              (val) =>
                validateDates(val, newEndDate) ||
                'Start Date Must Be Before End Date',
            ]"
          />
        </v-col>
        <v-col cols="12" sm="6" class="py-0">
          <CUDatePicker
            v-model="newEndDate"
            label="End Date"
            :rules="[
              (val) =>
                validateDates(newStartDate, val) ||
                'End Date Must Be After Start Date',
            ]"
          />
        </v-col>
      </v-row>
    </v-form>
    <CUModal v-model="isDeleteModalOpen">
      <template #title>Delete Adjustment</template>
      <template #text>
        Are you sure you want to delete this adjustment?
      </template>
      <template #actions>
        <v-spacer />
        <v-btn color="primary" small text @click="isDeleteModalOpen = false">
          Cancel
        </v-btn>
        <v-btn color="error" small @click="deleteMarkup">Delete</v-btn>
      </template>
    </CUModal>
  </Detail>
</template>

<script lang="ts">
import { Vue, Component, Watch, Inject, Provide } from 'vue-property-decorator'
import { AxiosResponse } from 'axios'

import UsersChangePassword from '@/components/UsersChangePassword.vue'

import type from '@/services/type'
import { SupportedVehicleType, VehicleType } from '@/models/dto'
import Detail from '@/layouts/Detail.vue'
import UsersDetailUserPhoto from '@/components/UsersDetailUserPhoto.vue'
import UsersDetailDriverInfo from '@/components/UsersDetailDriverInfo.vue'
import app from '@/store/modules/app'
import { RawLocation } from 'vue-router'
import { Markup, MarkupDetail, MarkupDay } from '@/models/dto/Markup'
import markup from '@/services/markup'
import deepClone from '@/utils/deepClone'
import dayjs from 'dayjs'
import { MarketRateType } from '@/models/dto/Rate'
import { isNotEmptyArray } from '@/utils/validators'

@Component({
  components: {
    Detail,
    UsersChangePassword,
    UsersDetailUserPhoto,
    UsersDetailDriverInfo,
  },
})
export default class AdjustmentDetail extends Vue {
  VEHICLE_TYPE_MARKUP_TYPE_ID = 7
  app = app

  newVehicleTypes: SupportedVehicleType[] = []
  newMarkupDays: MarkupDay[] = []
  newRateTypes: any[] = []
  newStartDate: string = dayjs().format('YYYY-MM-DD')
  newEndDate: string = dayjs().format('YYYY-MM-DD')

  vehicleTypes: VehicleType[] = []
  marketRateTypes: MarketRateType[] = []

  markupDays = [
    {
      val: { day: 1 },
      description: 'Monday',
    },
    {
      val: { day: 2 },
      description: 'Tuesday',
    },
    {
      val: { day: 3 },
      description: 'Wednesday',
    },
    {
      val: { day: 4 },
      description: 'Thursday',
    },
    {
      val: { day: 5 },
      description: 'Friday',
    },
    {
      val: { day: 6 },
      description: 'Saturday',
    },
    {
      val: { day: 7 },
      description: 'Sunday',
    },
  ]

  vehicleTypeError = false
  isDeleteModalOpen = false

  currentMarkup: MarkupDetail | Record<string, never> = {}
  model: any = {}

  isNotEmptyArray = isNotEmptyArray

  mounted(): void {
    this.setVehicleTypes()
    this.setMarketRateTypes()

    if (this.isModeEdit || this.isModeView) {
      this.getCurrentMarkup()
    }
  }

  get lastRoute(): RawLocation {
    const lastRoute = app.getLastRoute
    if (
      !app.getLastRoute?.name ||
      app.getLastRoute?.name === 'rates.adjustments.view' ||
      app.getLastRoute?.name === 'rates.adjustments.add'
    ) {
      return { name: 'rates.adjustments' }
    }
    return lastRoute
  }

  get vehicleTypeMap(): Record<number, SupportedVehicleType> {
    const map = this.vehicleTypes.reduce(
      (map: Record<number, SupportedVehicleType>, item: VehicleType) => {
        map[item.id] = {
          vehicleTypeId: item.id,
          label: item.label,
          key: item.key,
          supported: this.currentMarkup?.vehicleTypeKey === item.key,
        }
        return map
      },
      {}
    )

    return map
  }

  validateDates(startDate: string, endDate: string): boolean {
    return dayjs(startDate).isSameOrBefore(dayjs(endDate))
  }

  async getCurrentMarkup(): Promise<void> {
    try {
      const markupId = Number(this.$route.params.id)
      if (markupId) {
        const response = await markup.byId(markupId)
        const markupResponseData = response.data
        this.currentMarkup = markupResponseData.markup
        this.newMarkupDays = this.currentMarkup.markupDays.map((md) => {
          return { day: md.day }
        })
        this.newStartDate = dayjs(
          this.currentMarkup.startDate.split('T')[0]
        ).format('MM/DD/YYYY')
        this.newEndDate = dayjs(
          this.currentMarkup.endDate.split('T')[0]
        ).format('MM/DD/YYYY')
        this.newRateTypes = this.marketRateTypes.filter(
          (rt) => rt.key === this.currentMarkup.marketRateTypeKey
        )
        return
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
      return
    }
  }

  @Watch('mode')
  onModeChange(newMode: string): void {
    if (newMode === 'edit' || newMode === 'view') {
      this.getCurrentMarkup()
    }
  }

  get headerTitle(): string {
    switch (this.mode) {
      case 'add':
        return 'Add Adjustment'
      case 'edit':
        return `Edit Adjustment`
      default:
        return `Adjustment`
    }
  }

  get mode(): string {
    switch (this.$route.name) {
      case 'rates.adjustments.edit':
        return 'edit'
      case 'rates.adjustments.view':
        return 'view'
      default:
        return 'add'
    }
  }

  get isModeView(): boolean {
    return this.mode === 'view'
  }

  get isModeEdit(): boolean {
    return this.mode === 'edit'
  }

  get isModeAdd(): boolean {
    return this.mode === 'add'
  }

  get supportedVehicleTypes(): number {
    return this.newVehicleTypes.filter((vt) => vt.supported).length
  }

  updateVehicleTypes(vehicleTypeId: number, value: boolean): void {
    const supportedTypes = this.newVehicleTypes

    const matchingType = supportedTypes.find(
      (t) => Number(t.vehicleTypeId) === Number(vehicleTypeId)
    )
    if (matchingType) {
      matchingType.supported = value
    } else {
      supportedTypes.push({
        vehicleTypeId: vehicleTypeId,
        supported: value,
      })
    }
    if (this.supportedVehicleTypes !== 0) {
      this.vehicleTypeError = false
    } else {
      this.vehicleTypeError = true
    }
  }

  async deleteMarkup(): Promise<void> {
    if (!this.currentMarkup?.markupId) return
    const res = await markup.delete(this.currentMarkup.markupId)
    if (res.status === 200) {
      this.isDeleteModalOpen = false
      this.$router.push({
        name: 'rates.adjustments',
      })
    }
  }

  async setVehicleTypes(): Promise<void> {
    let response: AxiosResponse
    try {
      response = await type.vehicleTypeTableView({})
      const { data } = response
      this.vehicleTypes = data.resultList
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
      return
    }
  }

  async setMarketRateTypes(): Promise<void> {
    let response: AxiosResponse
    try {
      response = await type.marketRateType()
      const { data } = response
      this.marketRateTypes = data
      this.marketRateTypes = this.marketRateTypes.filter((mrt) =>
        ['daily_rate', 'hourly_rate', 'mileage'].includes(mrt.key)
      )
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
      return
    }
  }

  // Start Submit Methods
  prepareModelForSubmit(): void {
    this.model = deepClone(this.currentMarkup)
    this.model.markupTypeId = this.VEHICLE_TYPE_MARKUP_TYPE_ID
    this.model.customerId = null
    this.model.customerAccountId = null
    this.model.industryId = null
    this.model.eventId = null
    this.model.marketplace = false
    this.model.startDate = dayjs(this.newStartDate).toDate()
    this.model.endDate = dayjs(this.newEndDate).toDate()
    this.newVehicleTypes = this.newVehicleTypes
      .filter((nvt) => nvt.supported)
      .map((nvt) => {
        return {
          ...nvt,
          key: this.vehicleTypes.find((vt) => vt.id == nvt.vehicleTypeId).key,
        }
      })
    this.model.markupDays = this.newMarkupDays
  }

  async addNewMarkup(): Promise<void> {
    await Promise.all(
      this.newVehicleTypes.map((nvt) => {
        this.model.vehicleTypeKey = nvt.key
        this.newRateTypes.map((nrt) => {
          this.model.marketRateTypeKey = nrt
          markup.add(this.model as Markup)
        })
      })
    )
  }

  async editExistingMarkup(): Promise<number> {
    const response = await markup.edit(this.model as Markup)
    const markupResponseData = response.data
    return markupResponseData.markup.markupId
  }

  handleCancel(): void {
    if (this.isModeEdit) {
      this.$router.push({
        name: 'rates.adjustments.view',
        params: { id: this.$route.params.id },
      })
    } else if (this.isModeAdd) {
      this.$router.push({
        name: 'rates.adjustments',
      })
    }
  }

  async submit(): Promise<void> {
    // Casting a ref to `any` prevents a TS error when calling .validate()
    const form: any = this.$refs.form
    if (this.isModeAdd && this.supportedVehicleTypes === 0) {
      this.vehicleTypeError = true
    } else {
      this.vehicleTypeError = false
    }
    if (!form.validate() || this.vehicleTypeError) {
      return
    }

    await this.prepareModelForSubmit()

    if (this.isModeAdd) {
      await this.addNewMarkup()
      this.$router.push({
        name: 'rates.adjustments',
      })
    } else {
      const markupId: number = await this.editExistingMarkup()
      this.$router.push({
        name: 'rates.adjustments.view',
        params: { id: String(markupId) },
      })
    }
  }
}
</script>
