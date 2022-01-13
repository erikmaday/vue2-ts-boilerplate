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
            <!-- <ProfileIcon entityType="company" :editMode="mode === 'edit'" /> -->
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
                <AutocompleteAddress
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
                    (val) => validatePhoneNumber(val),
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
                    (val) => validatePhoneNumber(val),
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

import { Address } from '@/models/dto'
import auth from '@/store/modules/auth'
import company from '@/services/company'
import { Company } from '@/models/dto/Company'
import AutocompleteAddress from '@/components/AutocompleteAddress.vue'
import ProfileIcon from '@/components/ProfileIcon.vue'
import { verifyPhoneLength } from '@/utils/validators'

@Component({
  components: {
    AutocompleteAddress,
    ProfileIcon,
  },
})
export default class CompanyDetail extends Vue {
  notFound = false

  currentCompany: Company | Record<string, never> = {}

  mounted(): void {
    if (this.isModeEdit || this.isModeView) {
      this.getCurrentCompany()
    }
  }

  async getCurrentCompany(): Promise<void> {
    try {
      const companyId = auth.getUser.companyId
      if (companyId) {
        const response = await company.byId(companyId)
        const companyResponseData = response.data.company
        this.currentCompany = companyResponseData as Company
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

  get address(): Address {
    return this.currentCompany?.address
  }

  set address(addr: Address) {
    this.currentCompany.address = addr
  }

  validatePhoneNumber(val: string): boolean | string {
    return verifyPhoneLength(val) || 'Please enter a valid phone number'
  }

  async editExistingCompany(): Promise<number> {
    let companyId = Number(auth.getUser.companyId)
    await company.update(companyId, this.currentCompany as Company)
    return companyId
  }

  async submit(): Promise<void> {
    // Casting a ref to `any` prevents a TS error when calling .validate()
    const form: any = this.$refs.form
    if (!form.validate()) {
      return
    }

    await this.editExistingCompany()

    this.$router.push({
      name: 'settings',
    })
  }
}
</script>
