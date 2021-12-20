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
      <v-form :disabled="mode === 'view'">
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
                  v-model="currentUser.firstName"
                />
              </v-col>
              <v-col cols="6" class="py-0">
                <CUTextField
                  label="Last Name"
                  placeholder="Jones"
                  v-model="currentUser.lastName"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6" class="py-0">
                <CUTextField
                  label="Email"
                  placeholder="ajones@gmail.com"
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
                  v-model="isUserDriver"
                  label="This user is also a driver"
                />
              </v-col>
            </v-row>
            <v-expand-transition>
              <v-col
                v-show="isUserDriver"
                class="background-gray-header border-radius-5 padding-a-5"
              >
                <v-row>
                  <v-col cols="6">
                    <CUTextField
                      v-model="currentUser.drugTestNumber"
                      label="Drug Test #"
                    />
                  </v-col>
                  <v-col cols="3">
                    <CUSelect
                      v-model="currentUser.drugTestExpirationMonth"
                      label="Exp. Month"
                      item-text="short"
                      item-value="number"
                      :items="months"
                    />
                  </v-col>
                  <v-col cols="3">
                    <CUSelect
                      v-model="currentUser.drugTestExpirationYear"
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
                      v-model="currentUser.licenseNumber"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="6" class="padding-t-0">
                    <CUSelect
                      label="State"
                      :items="states"
                      v-model="currentUser.licensState"
                    />
                  </v-col>
                  <v-col cols="3" class="padding-t-0">
                    <CUSelect
                      label="Exp. Month"
                      item-text="short"
                      item-value="number"
                      :items="months"
                      v-model="currentUser.licenseExpirationMonth"
                    />
                  </v-col>
                  <v-col cols="3" class="padding-t-0">
                    <CUSelect
                      :items="years"
                      label="Exp. Year"
                      v-model="currentUser.licenseExpirationYear"
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
                      v-model="currentUser.notes"
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
                    v-for="(vType, vti) in vehicleTypes"
                    :key="`vehicle-type-${vti}`"
                    cols="4"
                  >
                    <v-checkbox
                      class="padding-a-0 margin-a-0"
                      hide-details
                      :label="vType.label"
                      @change="
                        (e) => updateVehicleTypes({ type: vType, value: e })
                      "
                    />
                  </v-col>
                </v-row>
              </v-col>
            </v-expand-transition>
            <v-row>
              <v-col class="margin-t-7">
                <v-btn small color="primary">Add User</v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-form>
      <v-dialog v-model="changePasswordIsOpen">
        <CompanyUsersChangePassword :user="currentUser" @close="changePasswordIsOpen = false"/>
      </v-dialog>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import user from '@/services/user'
import { getVehicleTypes } from '@/services/type'
import { UserDetailDriver, Group } from '@/models/dto'
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
  notFound = false
  states = states
  months = months

  currentUser: Partial<UserDetailDriver> = {
    firstName: '',
    lastName: '',
    email: '',
    groupId: 1,
    userPhotoDTOs: [],
    licenseNumber: '',
    driverSupportedVehicles: [],
  }

  isUserDriver = false
  vehicleTypes = []
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

  async getCurrentUser(): Promise<void> {
    let response: AxiosResponse
    try {
      if (this.$route.params.id) {
        const rolesResponse = await user.getRoles(Number(this.$route.params.id))
        const roles = rolesResponse.data.roles
        if (roles.find((role) => role.roleName === 'is_driver')) {
          this.isUserDriver = true

          response = await user.getDriverInfo(Number(this.$route.params.id))
          const { data } = response
          this.currentUser = data.driver
        } else {
          response = await user.byId(Number(this.$route.params.id))
          const { data } = response
          this.currentUser = data
        }
      } else {
        this.notFound = true
        return
      }
    } catch (e) {
      this.notFound = true
      console.error(e)
      return
    }
  }

  @Watch('currentUser', { immediate: true })
  onUserChanged(val: Partial<UserDetailDriver>) {
    if (val.drugTestExpiration && (!val.drugTestExpirationMonth || !val.drugTestExpirationYear)) {
      let dateArr = val.drugTestExpiration.split('-')
      this.currentUser.drugTestExpirationMonth = Number(dateArr[1])
      this.currentUser.drugTestExpirationYear = Number(dateArr[0])
    }
  }

  async setVehicleTypes(): Promise<void> {
    console.log('> setVehicleTypes')
    let response: AxiosResponse
    try {
      response = await getVehicleTypes({})
      console.log('> response:', response)
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

  updateVehicleTypes(e) {
    this.currentUser.driverSupportedVehicles =
      this.currentUser.driverSupportedVehicles || []

    if (e.value === true) {
      const type = this.currentUser?.driverSupportedVehicles?.find(
        (type) => type.key === e.type.key
      )
      if (!type) {
        this.currentUser.driverSupportedVehicles.push(e.type)
      }
    } else {
      this.currentUser.driverSupportedVehicles.filter((t) => t.key !== e.type.key)
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
