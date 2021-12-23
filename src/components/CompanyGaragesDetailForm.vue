<template>
  <v-form :disabled="isModeView" ref="form">
    <CUTextField
      v-model="model.garageName"
      :rules="[(val) => isNotEmpty(val) || 'Name is Required']"
      label="Name"
    />
    <AutocompleteAddress
      v-model="model.addressDTO"
      label="Address"
      :error-messages="formErrors.address"
      :rules="[(val) => isNotEmpty(val) || 'Address is Required']"
    />
    <CUTextArea
      v-model="model.defaultGarageNotes"
      label="Default Garage Notes"
      solo
      flat
      outlined
      rows="2"
    />
    <v-row v-if="isModeAdd" justify="space-between">
      <v-col cols="auto">
        <v-btn small plain @click="$router.push({ name: 'garages' })">
          Cancel
        </v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn color="primary" small @click="addGarage">Add Garage</v-btn>
      </v-col>
    </v-row>
    <v-row v-else-if="isModeEdit">
      <v-col cols="12">
        <v-btn class="w-full" color="primary" small @click="updateGarage">
          Update Garage
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import AutocompleteAddress from '@/components/AutocompleteAddress.vue'
import { isNotEmpty } from '@/utils/validators'
import {
  GarageRequest,
  GarageResult,
  Garage,
} from '@/models/dto/Garage'
import auth from '@/store/modules/auth'
import garage from '@/services/garage'
import { AxiosResponse } from 'axios'
import deepClone from '@/utils/deepClone'

@Component({
  components: { AutocompleteAddress },
})
export default class CompanyGaragesDetailForm extends Vue {
  model: Partial<Garage> = {}
  formErrors: Record<string, string[]> = {}
  isNotEmpty = isNotEmpty

  @Prop({
    required: true,
  })
  mode!: string

  @Prop({
    required: true,
  })
  currentGarage!: Garage

  @Prop({
    required: false,
  })
  garageId!: number | undefined

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
      defaultGarageNotes: this.model.defaultGarageNotes,
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
