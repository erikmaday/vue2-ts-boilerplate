<template>
  <v-col class="background-gray-header border-radius-5 padding-a-5">
    <v-row>
      <v-col cols="12" sm="6">
        <CUTextField
          v-model="driverModel.phoneNumber"
          :rules="[(val) => !!val || 'Phone Number is Required']"
          label="Phone Number"
        />
      </v-col>
    </v-row>
    <div
      class="
        border-solid border-gray-mid-light border-x-0 border-t-0 border-b-1
        margin-b-6
      "
    ></div>
    <v-row>
      <v-col cols="12" sm="6">
        <CUTextField v-model="driverModel.drugTestNumber" label="Drug Test #" />
      </v-col>
      <v-col cols="6" sm="3">
        <CUSelect
          v-model="driverModel.drugTestExpirationMonth"
          label="Exp. Month"
          item-text="name"
          item-value="num"
          :items="months"
        />
      </v-col>
      <v-col cols="6" sm="3">
        <CUSelect
          v-model="driverModel.drugTestExpirationYear"
          :items="years"
          label="Exp. Year"
        />
      </v-col>
    </v-row>
    <div
      class="
        border-solid border-gray-mid-light border-x-0 border-t-0 border-b-1
        margin-b-6
      "
    ></div>
    <v-row>
      <v-col cols="12" sm="6" class="padding-b-0">
        <CUTextField
          label="License #"
          v-model="driverModel.licenseNumber"
          :rules="[(val) => !!val || 'License Number is Required']"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="6" class="padding-t-0">
        <CUSelect
          label="State"
          :items="states"
          v-model="driverModel.licensState"
        />
      </v-col>
      <v-col cols="6" sm="3" class="padding-t-0">
        <CUSelect
          label="Exp. Month"
          item-text="name"
          item-value="num"
          :items="months"
          v-model="driverModel.licenseExpirationMonth"
          :rules="[(val) => !!val || 'Exp. Month is Required']"
        />
      </v-col>
      <v-col cols="6" sm="3" class="padding-t-0">
        <CUSelect
          :items="years"
          label="Exp. Year"
          v-model="driverModel.licenseExpirationYear"
          :rules="[(val) => !!val || 'Exp. Year is Required']"
        />
      </v-col>
    </v-row>
    <div
      class="
        border-solid border-gray-mid-light border-x-0 border-t-0 border-b-1
        margin-b-6
      "
    ></div>
    <v-row>
      <v-col>
        <v-textarea
          v-model="driverModel.notes"
          label="Notes"
          outlined
          flat
          solo
        />
      </v-col>
    </v-row>
    <h4 class="padding-b-3">Vehicle Types</h4>
    <v-row wrap>
      <v-col
        v-for="([key, type], vti) in Object.entries(vehicleTypeMap)"
        :key="`vehicle-type-${key}-${vti}`"
        cols="6"
        sm="4"
      >
        <v-checkbox
          class="padding-a-0 margin-a-0"
          hide-details
          :value="vehicleTypeMap[key].supported"
          :label="type.label"
          @change="(e) => updateVehicleTypes(Number(key), e || false)"
        />
      </v-col>
    </v-row>
  </v-col>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { UserDetailDriver } from '@/models/dto/UserDetailDriver'
import { SupportedVehicleType, VehicleType } from '@/models/dto'
import { states } from '@/utils/states'
import dayjs from 'dayjs'

@Component
export default class CompanyUsersDetailDriverInfo extends Vue {
  states = states
  months = dayjs
    .monthsShort()
    .map((month, index) => ({ name: month, num: index + 1 }))
  years: number[] = []

  driverModel: Partial<UserDetailDriver> = {
    drugTestNumber: '',
    drugTestExpiration: '',
    drugTestExpirationMonth: undefined,
    drugTestExpirationYear: undefined,
    licensState: '',
    licenseNumber: '',
    licenseExpirationMonth: dayjs().get('month') + 1,
    licenseExpirationYear: dayjs().get('year'),
    phoneNumber: '',
    notes: '',
    driverSupportedVehicles: [],
  }

  @Prop({
    required: true,
  })
  parentDriverModel!: UserDetailDriver

  @Prop({
    required: true,
  })
  vehicleTypes!: VehicleType[]

  // On first load, set driverModel equal to the current state
  // of its parent
  @Watch('parentDriverModel', { immediate: true, deep: true })
  onParentDriverModelUpdate(
    newParent: UserDetailDriver | Record<string, never>
  ): void {
    if (Object.keys(newParent).length) {
      this.driverModel.drugTestNumber = newParent.drugTestNumber
      this.driverModel.drugTestExpirationMonth =
        newParent.drugTestExpirationMonth
      this.driverModel.drugTestExpirationYear = newParent.drugTestExpirationYear
      this.driverModel.licensState = newParent.licensState
      this.driverModel.drugTestExpiration = newParent.drugTestExpiration
      this.driverModel.licenseNumber = newParent.licenseNumber
      this.driverModel.licenseExpirationMonth = newParent.licenseExpirationMonth
      this.driverModel.licenseExpirationYear = newParent.licenseExpirationYear
      this.driverModel.phoneNumber = newParent.phoneNumber
      this.driverModel.notes = newParent.notes
      this.driverModel.driverSupportedVehicles =
        newParent.driverSupportedVehicles
    }
  }

  @Watch('driverModel', { deep: true })
  onDriverModelUpdate(newDriverModel: UserDetailDriver): void {
    this.$emit('update-driver-model', newDriverModel)
  }

  get vehicleTypeMap(): Record<number, SupportedVehicleType> {
    const map = this.vehicleTypes.reduce(
      (map: Record<number, SupportedVehicleType>, item: VehicleType) => {
        map[item.id] = {
          vehicleTypeId: item.id,
          label: item.label,
          supported: false,
        }
        return map
      },
      {}
    )

    // let map: Record<number, SupportedVehicleType> = {}
    // this.vehicleTypes.map((vt: VehicleType) => {
    //   map[vt.id] = {
    //     vehicleTypeId: vt.id,
    //     label: vt.label,
    //     supported: false,
    //   }

    //   const reduceFn = (map, item) => {
    //     map[item.id] = {
    //       vehicleTypeId: item.id,
    //       label: item.label,
    //       supported: false
    //     }
    //     return map
    //   }

    if (this.driverModel.driverSupportedVehicles) {
      const supportedVehicles = this.driverModel.driverSupportedVehicles
      for (const st of supportedVehicles) {
        if (map[st.vehicleTypeId]) {
          map[st.vehicleTypeId].supported = st.supported
        }
      }
      // supportedVehicles.map((st: SupportedVehicleType) => {
      //   if (map[st.vehicleTypeId]) {
      //     map[st.vehicleTypeId].supported = st.supported
      //   }
      // })
    }

    return map
  }

  updateVehicleTypes(vehicleTypeId: number, value: boolean): void {
    const supportedTypes = this.driverModel.driverSupportedVehicles || []

    // .find() does not match with a triple === here
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
  }

  mounted(): void {
    // console.log(">  deepClone(this.parentDriverModel)",  deepClone(this.parentDriverModel))
    // this.driverModel = deepClone(this.parentDriverModel)

    const currentYear = dayjs().year()
    for (let i = currentYear - 1; i < currentYear + 20; i++) {
      this.years.push(i)
    }
  }
}
</script>
