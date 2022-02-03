<template>
  <v-form v-if="currentGarage" :disabled="isModeView" ref="form">
    <v-row>
      <v-col
        cols="12"
        md="6"
        class="padding-b-0"
        :class="{ 'margin-t-2': $vuetify.breakpoint.smAndDown }"
      >
        <CUSkeletonLoaderTextField v-if="loading" />
        <CUTextField
          v-else
          v-model="model.garageName"
          :rules="[(val) => isNotEmpty(val) || 'Name is Required']"
          label="Name"
          @input="$emit('update:currentGarage', model)"
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
        class="padding-b-0"
        :class="{ 'padding-t-0': $vuetify.breakpoint.smAndDown }"
      >
        <CUSkeletonLoaderTextField v-if="loading" />
        <AutocompleteAddress
          v-else
          v-model="model.addressDTO"
          label="Address"
          :error-messages="formErrors.address"
          :rules="[(val) => isNotEmpty(val) || 'Address is Required']"
        />
      </v-col>
    </v-row>
  </v-form>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import AutocompleteAddress from '@/components/AutocompleteAddress.vue'
import CUSkeletonLoaderTextField from '@/components/CUSkeletonLoaderTextField.vue'
import { isNotEmpty } from '@/utils/validators'
import { GarageRequest, GarageResult, Garage } from '@/models/dto/Garage'
import auth from '@/store/modules/auth'
import garage from '@/services/garage'
import { AxiosResponse } from 'axios'
import deepClone from '@/utils/deepClone'

@Component({
  components: { AutocompleteAddress, CUSkeletonLoaderTextField },
})
export default class GaragesDetailForm extends Vue {
  @Prop({ required: true }) mode!: string
  @Prop({ required: true }) currentGarage!: Garage
  @Prop({ type: Boolean, required: true }) loading!: boolean
  @Prop({ required: false }) garageId!: number | undefined

  model: Partial<Garage> = {}
  formErrors: Record<string, string[]> = {}
  isNotEmpty = isNotEmpty

  @Watch('currentGarage')
  onGarageUpdated(newGarage: Garage): void {
    this.model = deepClone(newGarage)
  }

  get isModeEdit(): boolean {
    return this.mode === 'edit'
  }

  get isModeAdd(): boolean {
    return this.mode === 'add'
  }

  get isModeView(): boolean {
    return this.mode === 'view'
  }

  validateForm(): boolean {
    this.formErrors = {}

    const form: any = this.$refs['form']
    if (!form.validate()) {
      return false
    }

    if (!this.model?.addressDTO) {
      this.formErrors.address = [
        'An address must be selected from the dropdown',
      ]
      return false
    }
    return true
  }

  buildGaragePayload(): GarageRequest {
    const payload: GarageRequest = {
      garage: true,
      defaultGarageNotes: '',
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      address: this.model.addressDTO!,
      parentCompanyId: auth.getUser.companyId,
      name: this.model.garageName || '',
    }
    return payload
  }

  async addGarage(): Promise<void> {
    if (!this.validateForm()) {
      return
    }

    const payload: GarageRequest = this.buildGaragePayload()
    const res: AxiosResponse<GarageResult> = await garage.create(payload)

    if (res.data.successful) {
      this.$router.push({
        name: 'garages.view',
        params: { id: String(res.data.company.companyId) },
      })
      this.$emit('refresh')
    }
  }

  async updateGarage(): Promise<void> {
    if (!this.validateForm()) {
      return
    }

    if (!this.garageId) {
      return
    }

    const payload: GarageRequest = this.buildGaragePayload()
    const res: AxiosResponse<GarageResult> = await garage.update(
      payload,
      this.garageId
    )
    if (res.data.successful) {
      this.$router.push({
        name: 'garages.view',
        params: { id: String(this.garageId) },
      })
    }
  }
}
</script>
