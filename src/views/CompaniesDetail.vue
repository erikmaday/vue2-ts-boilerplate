<template>
  <div>
    <v-container>
      <v-row justify="space-between">
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
              'flex-column': $vuetify.breakpoint.xs,
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
      <v-row
        class="padding-b-8"
        align="center"
        justify-sm="space-between"
        justify="center"
      ></v-row>
      <v-form :disabled="isModeView" ref="form" lazy-validation>
        <v-row>
          <v-col
            cols="12"
            md="4"
            :class="{
              'd-flex justify-center margin-b-5': $vuetify.breakpoint.smAndDown,
            }"
          >
            <CompanyPhoto
              :photoSrc="companyPhoto"
              :mode="mode"
              @upload="uploadCompanyPhoto"
            />
          </v-col>
          <v-col cols="12" md="8">
            <v-row>
              <v-col cols="12" sm="6" class="py-0">
                <CUTextField
                  label="Name"
                  :rules="[(val) => !!val || 'Name is Required']"
                  v-model="currentCompany.name"
                />
              </v-col>
              <v-col cols="12" sm="6" class="py-0">
                <CUTextField
                  label="DOT"
                  :rules="[(val) => !!val || 'DOT is Required']"
                  v-model="currentCompany.dotNumber"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col class="py-0">
                <CUTextField
                  label="Address"
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
                  v-model="currentCompany.email"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col class="py-0">
                <CUTextField
                  label="Website"
                  v-model="currentCompany.websiteUrl"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col class="py-0">
                <CUTextField
                  label="Company Phone"
                  v-mask="['(###) ###-####', '+## ## #### ####']"
                  :rules="[
                    (val) => !!val || 'Company Phone Number is Required',

                    (val) =>
                      verifyPhoneLength(val) ||
                      'Phone Number is Incorrect Length',
                  ]"
                  v-model="currentCompany.phone"
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

                    (val) =>
                      verifyPhoneLength(val) ||
                      'Phone Number is Incorrect Length',
                  ]"
                  v-model="currentCompany.opsPhone"
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-form>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'

import { baseUrl } from '@/utils/env'

import auth from '@/store/modules/auth'
import company from '@/services/company'
import { Company } from '@/models/dto/Company'
import CompanyPhoto from '@/components/CompanyPhoto.vue'
import app from '@/store/modules/app'

@Component({
  components: {
    CompanyPhoto,
  },
})
export default class CompaniesDetail extends Vue {
  validationErrors = {
    email: '',
  }

  app = app

  notFound = false
  treatAsDriver = false
  isChangePasswordOpen = false
  avatarLink = ''
  uploadedPhoto: FormData | undefined = undefined
  isDeleteModalOpen = false

  currentCompany: Company | Record<string, never> = {}
  companyPhoto = ''

  verifyPhoneLength(phoneNumber: string): boolean {
    return (
      phoneNumber != null &&
      (phoneNumber.replace(/[^0-9]/g, '').length === 10 ||
        phoneNumber.replace(/[^0-9]/g, '').length === 12)
    )
  }

  mounted(): void {
    if (this.isModeEdit || this.isModeView) {
      this.getCurrentCompany()
    }
  }

  // When hitting back button, prevent infinite loop when going from
  // view -> edit -> view, etc.
  pushLastRoute(): void {
    if (
      !app.getLastRoute?.name ||
      app.getLastRoute?.name === 'companies.view'
    ) {
      this.$router.push({ name: 'companies' })
    } else {
      this.$router.push(app.getLastRoute)
    }
  }

  // Get the user's roles. If we determine that the user is a driver,
  // pull user info from the getDriverById endpoint. Otherwise, use getUserByIdV2
  async getCurrentCompany(): Promise<void> {
    try {
      const companyId = auth.getUser.companyId
      if (companyId) {
        const response = await company.byId(companyId)
        const companyResponseData = response.data.company
        this.currentCompany = companyResponseData as Company
        let companyPhotoSrc = await company
          .getCompanyPhoto(this.currentCompany.companyId)
          .then((data) => data.data.imagePath)
        this.companyPhoto = `https://${baseUrl()}${companyPhotoSrc}`
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

  @Watch('mode')
  onModeChange(newMode: string): void {
    if (newMode === 'edit' || newMode === 'view') {
      this.getCurrentCompany()
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

  get address(): string {
    return this.currentCompany?.address?.street1
  }

  set address(addr: string) {
    this.currentCompany.address.street1 = addr
  }

  // Not sure what type to cast the event as here
  uploadCompanyPhoto(e: any): void {
    e.preventDefault()
    if (!e.target.files || !e.target?.files[0]) return

    const file = e.target.files[0]
    this.avatarLink = URL.createObjectURL(file)
    const formData = new FormData()
    formData.append('file', file)
    this.uploadedPhoto = formData
    this.companyPhoto = this.avatarLink
  }

  async editExistingCompany(): Promise<number> {
    let companyId = Number(auth.getUser.companyId)
    await company.update(companyId, this.currentCompany as Company)
    return companyId
  }

  resetFormValidation(): void {
    this.validationErrors = {
      email: '',
    }
  }

  async submit(): Promise<void> {
    this.resetFormValidation()

    // Casting a ref to `any` prevents a TS error when calling .validate()
    const form: any = this.$refs.form
    if (!form.validate()) {
      return
    }

    let companyId: number
    companyId = await this.editExistingCompany()

    if (this.uploadedPhoto) {
      company.uploadCompanyPhoto(companyId, this.uploadedPhoto)
    }

    this.$router.push({
      name: 'settings',
    })
  }
}
</script>
