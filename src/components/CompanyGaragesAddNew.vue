<template>
  <v-form ref="form">
    <CUTextField
      v-model="model.garageName"
      :rules="[(val) => isNotEmpty(val) || 'Name is Required']"
      label="Name"
    />
    <AutocompleteAddress
      v-model="model.address"
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
    <v-row justify="space-between">
      <v-col cols="auto">
        <v-btn small plain @click="$router.push({ name: 'garages' })">
          Cancel
        </v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn color="primary" small @click="addGarage">Add Garage</v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import AutocompleteAddress from '@/components/AutocompleteAddress.vue'
import { isNotEmpty } from '@/utils/validators'
import {
  CreateGarageRequest,
  CreateGarageResult,
  Garage,
} from '@/models/dto/Garage'
import auth from '@/store/modules/auth'
import garage from '@/services/garage'
import { AxiosResponse } from 'axios'

@Component({
  components: { AutocompleteAddress },
})
export default class CompanyGaragesAddNew extends Vue {
  model: Garage | Record<string, never> = {}
  formErrors: Record<string, string[]> = {}

  isNotEmpty = isNotEmpty

  async addGarage(): Promise<void> {
    this.formErrors = {}

    const form: any = this.$refs['form']
    if (!form.validate()) {
      return
    }

    if (!this.model?.address) {
      this.formErrors.address = [
        'An address must be selected from the dropdown',
      ]
      return
    }

    const payload: CreateGarageRequest = {
      garage: true,
      defaultGarageNotes: this.model.defaultGarageNotes,
      address: this.model.address,
      parentCompanyId: auth.getUser.companyId,
      name: this.model.garageName || '',
    }

    const res: AxiosResponse<CreateGarageResult> = await garage.create(payload)

    if (res.data.successful) {
      this.$router.push({
        name: 'garages.view',
        params: { id: String(res.data.company.companyId) },
      })
    }
  }
}
</script>
