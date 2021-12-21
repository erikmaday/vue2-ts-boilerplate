<template>
  <div>
    <v-container>
      <v-row
        justify-sm="space-between"
        justify="center"
        class="padding-b-6 padding-x-3"
      >
        <h1
          class="padding-b-5"
          :class="{
            'w-full text-center': $vuetify.breakpoint.xs,
          }"
        >
          {{ headerTitle }}
        </h1>
        <span>
          <v-btn
            class="margin-x-2"
            primary
            outlined
            small
            color="primary"
            @click="
              $router.push({
                name: 'users',
              })
            "
          >
            All Users
          </v-btn>
          <v-btn
            class="margin-x-2"
            v-show="mode === 'edit'"
            primary
            small
            color="primary"
            @click="changePasswordIsOpen = !changePasswordIsOpen"
          >
            Change Password
          </v-btn>
          <v-btn
            v-show="mode === 'view'"
            primary
            small
            color="primary"
            @click="
              $router.push({
                name: 'users.edit',
                params: { id: $route.params.id },
              })
            "
          >
            Edit
          </v-btn>
        </span>
      </v-row>
      <v-form :disabled="mode === 'view'" ref="form" lazy-validation>
        <v-row>
          <v-col
            cols="12"
            md="4"
            :class="{
              'd-flex justify-center margin-b-5': $vuetify.breakpoint.smAndDown,
            }"
          >
            <div class="user-photo">
              <div class="user-photo__src">
                <img
                  v-if="userPhoto !== ''"
                  class="h-full w-full"
                  :src="userPhoto"
                />
                <template v-else>
                  <div
                    class="
                      d-flex
                      align-center
                      justify-center
                      h-190
                      w-190
                      background-gray-header
                    "
                  >
                    <CUIcon color="gray-mid-light" width="120px" height="120px">
                      person
                    </CUIcon>
                  </div>
                </template>
              </div>
              <div v-show="mode !== 'view'" class="user-photo__upload-group">
                <button class="user-photo__upload-btn" @click="uploadUserPhoto">
                  <CUIcon color="white" width="24px" height="24px">
                    upload
                  </CUIcon>
                </button>
                <input type="file" accept="image/*" @change="uploadUserPhoto" />
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="8">
            <v-row>
              <v-col cols="6" class="py-0">
                <CUTextField
                  label="First Name"
                  placeholder="Andrea"
                  :rules="[(val) => !!val || 'First Name is Required']"
                  v-model="currentUser.firstName"
                />
              </v-col>
              <v-col cols="6" class="py-0">
                <CUTextField
                  label="Last Name"
                  placeholder="Jones"
                  :rules="[(val) => !!val || 'Last Name is Required']"
                  v-model="currentUser.lastName"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6" class="py-0">
                <CUTextField
                  label="Email"
                  placeholder="ajones@gmail.com"
                  :rules="[(val) => !!val || 'Email is Required']"
                  :disabled="mode === 'edit'"
                  v-model="currentUser.email"
                  :error-messages="validationErrors.email"
                />
              </v-col>
              <v-col cols="6" class="py-0">
                <CUSelect
                  v-model="currentUser.groupId"
                  :items="userGroups"
                  item-text="label"
                  item-value="groupId"
                  label="Type"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-checkbox
                  v-model="treatAsDriver"
                  label="This user is also a driver"
                  :disabled="currentUser.groupId === DRIVER_GROUP_ID"
                />
              </v-col>
            </v-row>
            <v-expand-transition>
              <v-col
                v-if="treatAsDriver"
                class="background-gray-header border-radius-5 padding-a-5"
              >
                <v-row>
                  <v-col cols="12" sm="6">
                    <CUTextField
                      v-model="currentUserAsDriver.phoneNumber"
                      :rules="[(val) => !!val || 'Phone Number is Required']"
                      label="Phone Number"
                    />
                  </v-col>
                </v-row>
                <div
                  class="
                    border-solid
                    border-gray-mid-light
                    border-x-0
                    border-t-0
                    border-b-1
                    margin-b-6
                  "
                ></div>
                <v-row>
                  <v-col cols="12" sm="6">
                    <CUTextField
                      v-model="currentUserAsDriver.drugTestNumber"
                      label="Drug Test #"
                    />
                  </v-col>
                  <v-col cols="6" sm="3">
                    <CUSelect
                      v-model="currentUserAsDriver.drugTestExpirationMonth"
                      label="Exp. Month"
                      item-text="short"
                      item-value="number"
                      :items="months"
                    />
                  </v-col>
                  <v-col cols="6" sm="3">
                    <CUSelect
                      v-model="currentUserAsDriver.drugTestExpirationYear"
                      :items="years"
                      label="Exp. Year"
                    />
                  </v-col>
                </v-row>
                <div
                  class="
                    border-solid
                    border-gray-mid-light
                    border-x-0
                    border-t-0
                    border-b-1
                    margin-b-6
                  "
                ></div>
                <v-row>
                  <v-col cols="12" sm="6" class="padding-b-0">
                    <CUTextField
                      label="License #"
                      v-model="currentUserAsDriver.licenseNumber"
                      :rules="[(val) => !!val || 'License Number is Required']"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="6" class="padding-t-0">
                    <CUSelect
                      label="State"
                      :items="states"
                      v-model="currentUserAsDriver.licensState"
                    />
                  </v-col>
                  <v-col cols="6" sm="3" class="padding-t-0">
                    <CUSelect
                      label="Exp. Month"
                      item-text="short"
                      item-value="number"
                      :items="months"
                      v-model="currentUserAsDriver.licenseExpirationMonth"
                    />
                  </v-col>
                  <v-col cols="6" sm="3" class="padding-t-0">
                    <CUSelect
                      :items="years"
                      label="Exp. Year"
                      v-model="currentUserAsDriver.licenseExpirationYear"
                    />
                  </v-col>
                </v-row>
                <div
                  class="
                    border-solid
                    border-gray-mid-light
                    border-x-0
                    border-t-0
                    border-b-1
                    margin-b-6
                  "
                ></div>
                <v-row>
                  <v-col>
                    <v-textarea
                      v-model="currentUserAsDriver.notes"
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
                      @change="(e) => updateVehicleTypes(key, e)"
                    />
                  </v-col>
                </v-row>
              </v-col>
            </v-expand-transition>
            <v-row>
              <v-col class="margin-t-7">
                <v-btn
                  v-show="this.mode !== 'view'"
                  small
                  :class="{ 'w-full': $vuetify.breakpoint.smAndDown }"
                  color="primary"
                  @click="submit"
                >
                  {{ this.mode === 'add' ? 'Add User' : 'Update User' }}
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-form>
      <v-dialog v-model="changePasswordIsOpen">
        <CompanyUsersChangePassword
          :user="currentUserAsDriver"
          @close="changePasswordIsOpen = false"
        />
      </v-dialog>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import dayjs from 'dayjs'
import { AxiosResponse } from 'axios'

import CUTextField from '@/components/CUTextField.vue'
import CUSelect from '@/components/CUSelect.vue'
import CompanyUsersChangePassword from '@/components/CompanyUsersChangePassword.vue'

import { states } from '@/utils/states'
import { months } from '@/utils/dates'
import { apiBaseUrl } from '@/utils/env'

import auth from '@/store/modules/auth'
import user from '@/services/user'
import { getVehicleTypes } from '@/services/type'
import { userGroups } from '@/data/userGroups'
import {
  UserDetail,
  UserDetailDriver,
  SupportedVehicleType,
  VehicleType,
} from '@/models/dto'

@Component({
  components: { CUTextField, CUSelect, CompanyUsersChangePassword },
})
export default class CompanyUsersEdit extends Vue {
  DRIVER_GROUP_ID = 4
  states = states
  months = months
  userGroups = userGroups

  validationErrors = {
    email: '',
  }

  vehicleTypes: VehicleType[] = []
  years: number[] = []

  notFound = false
  treatAsDriver = false
  changePasswordIsOpen = false
  avatarLink = ''
  uploadedPhoto: FormData | undefined = undefined

  currentUser: UserDetail = {
    firstName: '',
    lastName: '',
    email: '',
    groupId: 1,
    userPhotoDTOs: [],
    active: false,
    companyId: auth.getUser.companyId,
    companyName: auth.getUser.companyName,
    userRoleNames: [],
    treatAsDriver: false,
    locale: 'en_US',
  }

  currentUserAsDriver: UserDetailDriver = {
    active: true,
    firstName: '',
    lastName: '',
    email: '',
    groupId: 1,
    companyId: auth.getUser.companyId,
    companyName: auth.getUser.companyName,
    userPhotoDTOs: [],
    userRoleNames: ['is_driver'],
    drugTestNumber: '',
    drugTestExpiration: '',
    licensState: '',
    licenseNumber: '',
    licenseExpirationMonth: dayjs().get('month') + 1,
    licenseExpirationYear: dayjs().get('year'),
    phoneNumber: '',
    notes: '',
    driverSupportedVehicles: [],
    locale: 'en_US',
    treatAsDriver: true,
  }

  mounted(): void {
    this.setVehicleTypes()

    const currentYear = dayjs().year()
    for (let i = currentYear - 1; i < currentYear + 20; i++) {
      this.years.push(i)
    }

    if (this.mode === 'edit' || this.mode === 'view') {
      this.getCurrentUser()
    }
  }

  // Get the user's roles. If we determine that the user is a driver,
  // pull user info from the getDriverById endpoint. Otherwise, use getUserByIdV2
  async getCurrentUser(): Promise<void> {
    try {
      if (this.$route.params.id) {
        const rolesResponse = await user.getRoles(Number(this.$route.params.id))
        const roles = rolesResponse.data.roles
        if (roles.find((role) => role.roleName === 'is_driver')) {
          this.treatAsDriver = true
          const response = await user.getDriverById(
            Number(this.$route.params.id)
          )
          const userResponseData = response.data.driver
          this.currentUser = userResponseData as UserDetail
          this.currentUserAsDriver = userResponseData
          this.populateDrugExpirationDateInputs()
        } else {
          const response = await user.byId(Number(this.$route.params.id))
          const userResponseData = response.data

          this.currentUser = userResponseData
          this.currentUserAsDriver = userResponseData as UserDetailDriver
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

  // We store drug expiration dates as a string, instead of
  // as separate values like we do for license expirations
  populateDrugExpirationDateInputs(): void {
    if (
      this.currentUserAsDriver.drugTestExpiration &&
      (!this.currentUserAsDriver.drugTestExpirationMonth ||
        !this.currentUserAsDriver.drugTestExpirationYear)
    ) {
      let dateArr = this.currentUserAsDriver.drugTestExpiration.split('-')
      if (dateArr.length > 1) {
        this.currentUserAsDriver.drugTestExpirationMonth = Number(dateArr[1])
        this.currentUserAsDriver.drugTestExpirationYear = Number(dateArr[0])
      }
    }
  }

  @Watch('currentUser', { immediate: true, deep: true })
  onCurrentUserChanged(updatedUser: UserDetail): void {
    this.currentUserAsDriver = Object.assign(
      {},
      this.currentUserAsDriver,
      updatedUser
    )

    if (updatedUser.groupId === 4) {
      this.treatAsDriver = true
    }
  }

  @Watch('treatAsDriver', { immediate: true })
  onTreatAsDriverChanged(isDriver: boolean): void {
    const hasDriverRole = this.currentUser.userRoleNames.includes('is_driver')
    if (isDriver && !hasDriverRole) {
      this.currentUser.userRoleNames.push('is_driver')
    } else if (!isDriver && hasDriverRole) {
      this.currentUser.userRoleNames = this.currentUser.userRoleNames.filter(
        (r) => r !== 'is_driver'
      )
    }
  }

  get headerTitle(): string {
    switch (this.mode) {
      case 'add':
        return 'Add User'
      case 'edit':
        return 'Edit User'
      default:
        return 'View User'
    }
  }

  get mode(): string {
    switch (this.$route.name) {
      case 'users.edit':
        return 'edit'
      case 'users.view':
        return 'view'
      default:
        return 'add'
    }
  }

  get userPhoto(): string {
    if (this.avatarLink) {
      return this.avatarLink
    }
    if (this.currentUser?.userPhotoDTOs?.length) {
      return `https://${apiBaseUrl(null)}${
        this.currentUser.userPhotoDTOs[0].imagePath
      }`
    }
    return ''
  }

  get vehicleTypeMap(): Record<number, SupportedVehicleType> {
    let map: Record<number, SupportedVehicleType> = {}
    this.vehicleTypes.map((vt: VehicleType) => {
      map[vt.id] = {
        vehicleTypeId: vt.id,
        label: vt.label,
        supported: false,
      }
    })

    if (this.currentUserAsDriver.driverSupportedVehicles) {
      const supportedVehicles = this.currentUserAsDriver.driverSupportedVehicles
      supportedVehicles.map((st: SupportedVehicleType) => {
        if (map[st.vehicleTypeId]) {
          map[st.vehicleTypeId].supported = st.supported
        }
      })
    }

    return map
  }

  async setVehicleTypes(): Promise<void> {
    let response: AxiosResponse
    try {
      response = await getVehicleTypes({})
      const { data } = response
      this.vehicleTypes = data.resultList

      if (this.mode === 'add') {
        this.currentUserAsDriver.driverSupportedVehicles =
          this.vehicleTypes.map((vt) => ({
            vehicleTypeId: vt.id,
            label: vt.label,
            supported: false,
          }))
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
      return
    }
  }

  // Not sure what type to cast the event as here
  uploadUserPhoto(e: any): void {
    e.preventDefault()
    if (!e.target?.files[0]) return

    const file = e.target.files[0]
    this.avatarLink = URL.createObjectURL(file)
    const formData = new FormData()
    formData.append('file', file)
    this.uploadedPhoto = formData
  }

  updateVehicleTypes(vehicleTypeId: number, value: boolean): void {
    const supportedTypes =
      this.currentUserAsDriver.driverSupportedVehicles || []

    // .find() does not match with a triple === here
    const matchingType = supportedTypes.find(
      (t) => t.vehicleTypeId == vehicleTypeId
    )
    if (matchingType) {
      matchingType.supported = value
    }
  }

  prepareModelForSubmit(): void {
    const { drugTestExpirationMonth: month, drugTestExpirationYear: year } =
      this.currentUserAsDriver
    if (month && year) {
      this.currentUserAsDriver.drugTestExpiration = dayjs(
        new Date(year, month, 1)
      ).format('YYYY-MM-DD')
    } else {
      this.currentUserAsDriver.drugTestExpiration = undefined
    }

    this.currentUser.active = true
    this.currentUser.treatAsDriver = this.treatAsDriver
  }

  // Return the user ID of the added user
  async addNewUser(): Promise<number> {
    const res = await user.checkIfEmailExists(this.currentUser.email)
    if (res.data.exists) {
      this.validationErrors.email = 'This email already exists.'
      return -1
    }
    if (this.treatAsDriver) {
      const newDriverResponse = await user.createDriver(
        this.currentUserAsDriver
      )
      return newDriverResponse.data
    } else {
      const newUserResponse = await user.createUser(this.currentUser)
      return newUserResponse.data
    }
  }

  async editExistingUser(): Promise<number> {
    const userId = Number(this.$route.params.id)

    if (this.treatAsDriver) {
      await user.makeDriver(userId)
      await user.updateDriver(userId, this.currentUserAsDriver)
    } else {
      await user.deactivateDriver(userId)
      await user.updateUser(userId, this.currentUser)
    }

    return userId
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

    this.prepareModelForSubmit()

    let userId: number
    if (this.mode === 'add') {
      userId = await this.addNewUser()
    } else {
      userId = await this.editExistingUser()
    }

    if (this.uploadedPhoto) {
      user.uploadUserPhoto(userId, this.uploadedPhoto)
    }

    this.$router.push({ name: 'users.view', params: { id: String(userId) } })
  }
}
</script>

<style lang="scss" scoped>
// Not sure if some of this should be converted to helper classes--
// seems like it might be more intuitive to have all the styling in
// one place though?
.user-photo {
  position: relative;
  max-width: 200px;

  &__src {
    width: 200px;
    height: 200px;
    object-fit: cover;
    border-radius: 50%;
    overflow: hidden;
    border: 5px solid $gray-border;
  }

  &__upload-btn {
    width: 50px;
    height: 50px;
    background: #00a6f2;
    outline: none;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  &__upload-group {
    position: absolute;
    right: 11px;
    bottom: 2px;

    input {
      width: 50px;
      height: 50px;
      position: absolute;
      top: 0;
      opacity: 0;
      z-index: 100;
      cursor: pointer;
    }
  }
}
</style>
