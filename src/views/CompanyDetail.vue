<template>
  <div>
    <v-row justify="space-between" class="margin-b-2">
      <v-col cols="12" md="7">
        <div
          class="d-flex align-center"
          :class="{
            'flex-column': $vuetify.breakpoint.smAndDown,
            'flex-row': $vuetify.breakpoint.mdAndUp,
          }"
        >
          <h1
            class="margin-a-0"
            :class="{
              'text-center': $vuetify.breakpoint.xs,
            }"
          >
            Company Information
          </h1>
        </div>
      </v-col>
      <v-col cols="12" md="5">
        <div
          class="d-flex"
          :class="{
            'flex-row': $vuetify.breakpoint.smAndUp,
            'justify-center': $vuetify.breakpoint.sm,
            'justify-end': $vuetify.breakpoint.mdAndUp,
            'flex-column flex-column-reverse': $vuetify.breakpoint.xs,
          }"
        >
          <v-btn
            v-show="isModeEdit"
            :class="{
              'w-full margin-y-2': $vuetify.breakpoint.xs,
              'margin-l-4': $vuetify.breakpoint.smAndUp,
            }"
            outlined
            small
            color="primary"
            @click="
              $router.push({
                name: 'settings',
                params: { id: $route.params.id },
              })
            "
          >
            Cancel
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
                name: 'settings.edit',
                params: { id: $route.params.id },
              })
            "
          >
            Edit
          </v-btn>
          <v-btn
            v-show="isModeEdit"
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
        </div>
      </v-col>
    </v-row>
    <v-form :disabled="isModeView" ref="form" lazy-validation>
      <v-row>
        <v-col
          cols="12"
          md="5"
          :class="{
            'd-flex justify-center margin-b-5': $vuetify.breakpoint.smAndDown,
          }"
        >
          <v-row>
            <v-col cols="12">
              <CompanyLogoUpload
                class="padding-r-4"
                label="Light Logo"
                caption="Light logos use light text so they show up well on dark backgrounds."
                :src="lightLogoSource"
                :disabled="isModeView"
                @input="lightLogoFile = $event"
              />
            </v-col>
            <v-col cols="12">
              <CompanyLogoUpload
                class="padding-r-4"
                label="Dark Logo"
                caption="Dark logos use dark text so they show up well on light backgrounds."
                :src="darkLogoSource"
                :disabled="isModeView"
                @input="darkLogoFile = $event"
              />
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" md="7">
          <v-row>
            <v-col cols="12" sm="6">
              <CUTextField
                label="Name"
                :rules="[(val) => !!val || 'Name is Required']"
                v-model="company.name"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <CUTextField
                label="DOT"
                :rules="[(val) => !!val || 'DOT is Required']"
                v-model="company.dotNumber"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col class="py-0">
              <AutocompleteAddress
                label="Address"
                :error-messages="formErrors.address"
                :rules="[(val) => !!val || 'Address is Required']"
                v-model="address"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col class="py-0">
              <CUTextField
                label="Email"
                :rules="[(val) => !!val || 'Email is Required']"
                v-model="company.email"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col class="py-0">
              <CUTextField label="Website" v-model="company.websiteUrl" />
            </v-col>
          </v-row>
          <v-row>
            <v-col class="py-0">
              <CUTextField
                label="Company Phone"
                v-mask="['(###) ###-####', '+## ## #### ####']"
                :rules="[
                  (val) => !!val || 'Company Phone Number is Required',
                  (val) => validatePhoneNumber(val),
                ]"
                v-model="company.phone"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col class="py-0">
              <CUTextField
                label="Dispatch Phone"
                v-mask="['(###) ###-####', '+## ## #### ####']"
                :rules="[
                  (val) => !!val || 'Dispatch Phone Number is Required',
                  (val) => validatePhoneNumber(val),
                ]"
                v-model="company.opsPhone"
              />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'

import { Address } from '@/models/dto'
import auth from '@/store/modules/auth'
import company from '@/services/company'
import { Company } from '@/models/dto/Company'
import AutocompleteAddress from '@/components/AutocompleteAddress.vue'
import CompanyLogoUpload from '@/components/CompanyLogoUpload.vue'
import { verifyPhoneLength } from '@/utils/validators'
import { baseUrl } from '@/utils/env'

@Component({
  components: {
    AutocompleteAddress,
    CompanyLogoUpload,
  },
})
export default class CompanyDetail extends Vue {
  notFound = false
  formErrors: Record<string, string[]> = {}
  company: Company | Record<string, never> = {}
  companyPhoto = ''
  lightLogoFile: File | null = null
  darkLogoFile: File | null = null

  lightLogoSource = ''
  darkLogoSource = ''

  @Watch('lightLogoFile', { deep: true })
  lightLogoFileChanged(value: File | null): void {
    if (value) {
      this.lightLogoSource = URL.createObjectURL(value)
    }
  }

  @Watch('darkLogoFile', { deep: true })
  darkLogoFileChanged(value: File | null): void {
    if (value) {
      this.darkLogoSource = URL.createObjectURL(value)
    }
  }

  @Watch('mode')
  onModeChange(newMode: string): void {
    if (newMode === 'view') {
      this.getCompany()
    }
  }

  mounted(): void {
    if (this.isModeEdit || this.isModeView) {
      this.getCompany()
    }
  }

  async getCompany(): Promise<void> {
    try {
      const companyId = auth.getUser.companyId
      if (companyId) {
        const response = await company.byId(companyId)
        const companyResponseData = response.data.company
        this.company = companyResponseData as Company
        if (this.company.lightLogoUrl) {
          this.lightLogoSource = `https://${baseUrl()}${
            this.company.lightLogoUrl
          }`
        }
        if (this.company.darkLogoUrl) {
          this.lightLogoSource = `https://${baseUrl()}${
            this.company.darkLogoUrl
          }`
        }
      } else {
        this.notFound = true
        return
      }
    } catch (e) {
      this.notFound = true
      // eslint-disable-next-line no-console
      console.error(e)
      return
    }
  }

  get mode(): string {
    switch (this.$route.name) {
      case 'settings.edit':
        return 'edit'
      default:
        return 'view'
    }
  }

  get isModeView(): boolean {
    return this.mode === 'view'
  }

  get isModeEdit(): boolean {
    return this.mode === 'edit'
  }

  get address(): Address {
    return this.company?.address
  }

  set address(addr: Address) {
    this.company.address = addr
  }

  validatePhoneNumber(val: string): boolean | string {
    return verifyPhoneLength(val) || 'Please enter a valid phone number'
  }

  async editExistingCompany(): Promise<number> {
    let companyId = Number(auth.getUser.companyId)
    await company.update(companyId, this.company as Company)
    return companyId
  }

  async uploadPhoto(type: string): Promise<void> {
    await this.$store.dispatch('companies/uploadBrandingPhoto', {
      payload: this[`${type}File`],
      id: this.id,
      type,
    })

  uploadBrandingPhoto(store, payload) {
    const host = baseUrl()
    const url = `https://${host}/v2/photos/companies/${payload.id}/companyBrandings/${payload.type}`
    return axios.put(url, payload.payload)
  }

  async submit(): Promise<void> {
    this.formErrors = {}

    // Casting a ref to `any` prevents a TS error when calling .validate()
    const form: any = this.$refs.form
    if (!form.validate()) {
      return
    }

    if (this.address == null) {
      this.formErrors.address = [
        'An address must be selected from the dropdown',
      ]
      return
    }

    await this.editExistingCompany()

    this.$router.push({
      name: 'settings',
    })
  }
}
</script>
