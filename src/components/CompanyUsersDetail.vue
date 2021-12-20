<template>
  <div>
    <v-container>
      <v-row justify="space-between" class="padding-b-6 padding-x-3">
        <h1 class="padding-b-5">{{ headerTitle }}</h1>
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
          <v-col cols="4">
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
                <button class="user-photo__upload-btn" @click="uploadFile">
                  <CUIcon color="white" width="24px" height="24px">
                    upload
                  </CUIcon>
                </button>
                <input type="file" accept="image/*" @change="uploadFile" />
              </div>
            </div>
          </v-col>
          <v-col cols="8">
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
                  v-model="currentUser.email"
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
                  <v-col cols="6">
                    <CUTextField
                      v-model="currentUserAsDriver.phoneNumber"
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
                  <v-col cols="6">
                    <CUTextField
                      v-model="currentUserAsDriver.drugTestNumber"
                      label="Drug Test #"
                    />
                  </v-col>
                  <v-col cols="3">
                    <CUSelect
                      v-model="currentUserAsDriver.drugTestExpirationMonth"
                      label="Exp. Month"
                      item-text="short"
                      item-value="number"
                      :items="months"
                    />
                  </v-col>
                  <v-col cols="3">
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
                  <v-col cols="6" class="padding-b-0">
                    <CUTextField
                      label="License #"
                      v-model="currentUserAsDriver.licenseNumber"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="6" class="padding-t-0">
                    <CUSelect
                      label="State"
                      :items="states"
                      v-model="currentUserAsDriver.licensState"
                    />
                  </v-col>
                  <v-col cols="3" class="padding-t-0">
                    <CUSelect
                      label="Exp. Month"
                      item-text="short"
                      item-value="number"
                      :items="months"
                      v-model="currentUserAsDriver.licenseExpirationMonth"
                    />
                  </v-col>
                  <v-col cols="3" class="padding-t-0">
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
                    cols="4"
                  >
                    <v-checkbox
                      class="padding-a-0 margin-a-0"
                      hide-details
                      :value="vehicleTypeMap[key].supported"
                      :label="type.label"
                      @change="
                        (e) => updateVehicleTypes({ type: type, value: e })
                      "
                    />
                  </v-col>
                </v-row>
              </v-col>
            </v-expand-transition>
            <v-row>
              <v-col class="margin-t-7">
                <v-btn v-show="this.mode !== 'view'" small color="primary" @click="submit">
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
import user from '@/services/user'
import auth from '@/store/modules/auth'
import { getVehicleTypes } from '@/services/type'
import { UserDetail, UserDetailDriver, Group, SupportedVehicleType, VehicleType } from '@/models/dto'
import { AxiosResponse } from 'axios'
import CUTextField from '@/components/CUTextField.vue'
import CUSelect from '@/components/CUSelect.vue'
import CUIcon from '@/components/CUIcon.vue'
import { states } from '@/utils/states'
import { months } from '@/utils/dates'
import { apiBaseUrl } from '@/utils/env'
import dayjs from 'dayjs'
import CompanyUsersChangePassword from '@/components/CompanyUsersChangePassword.vue'

@Component({
  components: { CUTextField, CUSelect, CUIcon, CompanyUsersChangePassword },
})
export default class CompanyUsersEdit extends Vue {
  DRIVER_GROUP_ID = 4
  
  notFound = false
  states = states
  months = months

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
  }

  treatAsDriver = false
  vehicleTypes: VehicleType[] = []
  years: number[] = []
  changePasswordIsOpen = false

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

  // Get the user's roles
  // If we determine that the user is a driver, pull the user info from the
  // getDriverById endpoint
  // Otherwise, use getUserByIdV2
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

  @Watch('currentUser', { immediate: true, deep: true })
  onUserChanged(updatedUser: UserDetail): void {
    // if (val.drugTestExpiration && (!val.drugTestExpirationMonth || !val.drugTestExpirationYear)) {
    //   let dateArr = val.drugTestExpiration.split('-')
    //   this.currentUser.drugTestExpirationMonth = Number(dateArr[1])
    //   this.currentUser.drugTestExpirationYear = Number(dateArr[0])
    // }
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

  async setVehicleTypes(): Promise<void> {
    let response: AxiosResponse
    try {
      response = await getVehicleTypes({})
      const { data } = response
      this.vehicleTypes = data.resultList
    } catch (e) {
      console.error(e)
      return
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

  avatarLink = ''

  uploadFile(e) {
    e.preventDefault()

    const file = e.target.files[0]
    this.avatarLink = URL.createObjectURL(file)

    // const formData = new FormData()
    // formData.append('file', file)
    // this.uploadedFile = formData
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
    //     if (map[st.vehicleTypeId]) {
    //       map[st.vehicleTypeId].supported = st.supported
    //     }
      })
    }


    return map
  }

  updateVehicleTypes(vehicleTypeId: number, value: boolean): void {
    const supportedTypes =
      this.currentUserAsDriver.driverSupportedVehicles || []
    const matchingType = supportedTypes.find(
      (t) => t.vehicleTypeId === vehicleTypeId
    )
    if (matchingType) {
      matchingType.supported = value
    }
  }

  // Probably should be extracted elsewhere instead of hardcoded here?
  userGroups: Group[] = [
    {
      groupId: 1,
      label: 'Admin',
      key: 'admin',
    },
    {
      groupId: 2,
      label: 'User',
      key: 'user',
    },
    {
      groupId: 4,
      label: 'Driver',
      key: 'driver',
    },
  ]

  async submit(): Promise<void> {
    // Casting this prevents a TS error calling .validate()
    const form: any = this.$refs.form
    if (!form.validate()) {
      return
    }

    if (this.mode === 'add') {
      if (this.treatAsDriver) {
        const response = await user.createDriver(this.currentUserAsDriver)
        console.log("> response:", response)
      } else {
        const response = await user.createUser(this.currentUser)
        console.log("> response:", response)
      }
    }

    // else {

    // }
  }
}
</script>

<style lang="scss" scoped>
.user-photo {
  position: relative;
  max-width: 200px;
}
.user-photo__src {
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 50%;
  overflow: hidden;
  border: 5px solid $gray-border;
}

.user-photo__upload-btn {
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

.user-photo__upload-group {
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
</style>
