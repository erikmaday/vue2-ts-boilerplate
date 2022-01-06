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
            <v-btn
              :icon="$vuetify.breakpoint.mdAndUp"
              :x-small="$vuetify.breakpoint.mdAndUp"
              :small="$vuetify.breakpoint.smAndDown"
              plain
              @click="pushLastRoute"
            >
              <CUIcon width="20px" height="20px" color="primary">
                arrow_left
              </CUIcon>
              <span
                v-if="$vuetify.breakpoint.smAndDown"
                class="margin-l-1 text-primary"
              >
                Back
              </span>
            </v-btn>
            <h1
              class="margin-a-0"
              :class="{
                'text-center': $vuetify.breakpoint.xs,
              }"
            >
              {{ headerTitle }}
            </h1>
          </div>
        </v-col>
        <v-col cols="12" md="5">
          <div
            class="d-flex"
            :class="{
              'flex-row': $vuetify.breakpoint.smAndUp,
              'justify-center': $vuetify.breakpoint.sm,
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
                  name: 'users.view',
                  params: { id: $route.params.id },
                })
              "
            >
              Cancel
            </v-btn>
            <v-btn
              :class="{
                'w-full margin-y-2': $vuetify.breakpoint.xs,
                'margin-l-4': $vuetify.breakpoint.smAndUp,
              }"
              v-show="isModeView"
              primary
              small
              color="error"
              @click="isDeleteModalOpen = true"
            >
              Delete
            </v-btn>
            <v-btn
              :class="{
                'w-full margin-y-2': $vuetify.breakpoint.xs,
                'margin-l-4': $vuetify.breakpoint.smAndUp,
              }"
              v-show="isModeView"
              primary
              small
              color="primary"
              @click="isChangePasswordOpen = !isChangePasswordOpen"
            >
              Change Password
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
                  name: 'users.edit',
                  params: { id: $route.params.id },
                })
              "
            >
              Edit
            </v-btn>
            <v-btn
              v-show="isModeEdit || isModeAdd"
              :class="{
                'w-full margin-y-2': $vuetify.breakpoint.xs,
                'margin-l-4': $vuetify.breakpoint.smAndUp,
              }"
              small
              color="primary"
              @click="submit"
            >
              {{ isModeAdd ? 'Add User' : 'Save' }}
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
            <UsersDetailUserPhoto
              :photoSrc="userPhoto"
              :mode="mode"
              @upload="uploadUserPhoto"
            />
          </v-col>
          <v-col cols="12" md="8">
            <v-row>
              <v-col cols="12" sm="6" class="py-0">
                <CUTextField
                  label="First Name"
                  placeholder="Andrea"
                  :rules="[(val) => !!val || 'First Name is Required']"
                  v-model="currentUser.firstName"
                />
              </v-col>
              <v-col cols="12" sm="6" class="py-0">
                <CUTextField
                  label="Last Name"
                  placeholder="Jones"
                  :rules="[(val) => !!val || 'Last Name is Required']"
                  v-model="currentUser.lastName"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6" class="py-0">
                <CUTextField
                  label="Email"
                  placeholder="ajones@gmail.com"
                  :rules="[(val) => !!val || 'Email is Required']"
                  :disabled="isModeEdit"
                  v-model="currentUser.email"
                  :error-messages="validationErrors.email"
                />
              </v-col>
              <v-col cols="12" sm="6" class="py-0">
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
              <UsersDetailDriverInfo
                v-if="treatAsDriver"
                ref="driverInfoForm"
                :parent-driver-model="currentUserAsDriver"
                :vehicle-types="vehicleTypes"
                @update-driver-model="updateModels"
              />
            </v-expand-transition>
          </v-col>
        </v-row>
      </v-form>
      <UsersChangePassword
        v-model="isChangePasswordOpen"
        :userId="currentUserAsDriver.userId || Number($route.params.id)"
      />
      <CUModal v-model="isDeleteModalOpen">
        <template #title>Delete User</template>
        <template #text>Are you sure you want to delete this user?</template>
        <template #actions>
          <v-spacer />
          <v-btn
            color="primary"
            outlined
            small
            text
            @click="isDeleteModalOpen = false"
          >
            Cancel
          </v-btn>
          <v-btn color="error" small @click="deleteUser">Delete</v-btn>
          <v-spacer />
        </template>
      </CUModal>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import dayjs from 'dayjs'
import { AxiosResponse } from 'axios'

import UsersChangePassword from '@/components/UsersChangePassword.vue'

import { baseUrl } from '@/utils/env'

import auth from '@/store/modules/auth'
import user from '@/services/user'
import driver from '@/services/driver'
import type from '@/services/type'
import { userGroups } from '@/data/userGroups'
import { ApiResult, UserDetail, VehicleType } from '@/models/dto'
import UsersDetailUserPhoto from '@/components/UsersDetailUserPhoto.vue'
import UsersDetailDriverInfo from '@/components/UsersDetailDriverInfo.vue'
import { UserDetailDriver } from '@/models/dto/UserDetailDriver'
import app from '@/store/modules/app'

@Component({
  components: {
    UsersChangePassword,
    UsersDetailUserPhoto,
    UsersDetailDriverInfo,
  },
})
export default class UsersDetail extends Vue {
  DRIVER_GROUP_ID = 4
  userGroups = userGroups

  validationErrors = {
    email: '',
  }

  app = app

  vehicleTypes: VehicleType[] = []

  notFound = false
  treatAsDriver = false
  isChangePasswordOpen = false
  avatarLink = ''
  uploadedPhoto: FormData | undefined = undefined
  isDeleteModalOpen = false

  currentUser: UserDetail | Record<string, never> = {}

  currentUserAsDriver: UserDetailDriver | Record<string, never> = {}

  mounted(): void {
    this.setVehicleTypes()

    if (this.isModeEdit || this.isModeView) {
      this.getCurrentUser()
    }
  }

  // When hitting back button, prevent infinite loop when going from
  // view -> edit -> view, etc.
  pushLastRoute(): void {
    if (!app.getLastRoute?.name || app.getLastRoute?.name === 'users.view') {
      this.$router.push({ name: 'users' })
    } else {
      this.$router.push(app.getLastRoute)
    }
  }

  // Get the user's roles. If we determine that the user is a driver,
  // pull user info from the getDriverById endpoint. Otherwise, use getUserByIdV2
  async getCurrentUser(): Promise<void> {
    try {
      if (this.$route.params.id) {
        const rolesResponse = await user.roles(Number(this.$route.params.id))
        const roles = rolesResponse.data.roles
        if (roles.find((role) => role.roleName === 'is_driver')) {
          this.treatAsDriver = true
          const response = await driver.byId(Number(this.$route.params.id))
          const userResponseData = response.data.driver
          userResponseData.userRoleNames = roles.map((role) => role.roleName)
          this.currentUser = userResponseData as UserDetail
          this.currentUserAsDriver = userResponseData
          this.populateDrugExpirationDateInputs()
        } else {
          const response = await user.byId(Number(this.$route.params.id))
          const userResponseData = response.data
          userResponseData.userRoleNames = roles.map((role) => role.roleName)

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
    if (updatedUser.groupId === this.DRIVER_GROUP_ID) {
      this.treatAsDriver = true
    }
  }

  @Watch('treatAsDriver', { immediate: true })
  onTreatAsDriverChanged(isDriver: boolean): void {
    if (!this.currentUser.userRoleNames) {
      this.currentUser.userRoleNames = []
    }

    const hasDriverRole = this.currentUser.userRoleNames.includes('is_driver')
    if (isDriver && !hasDriverRole) {
      this.currentUser.userRoleNames.push('is_driver')
    } else if (!isDriver && hasDriverRole) {
      this.currentUser.userRoleNames = this.currentUser.userRoleNames.filter(
        (r) => r !== 'is_driver'
      )
    }
  }

  @Watch('mode')
  onModeChange(newMode: string): void {
    if (newMode === 'edit' || newMode === 'view') {
      this.getCurrentUser()
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
      const userPhotoSrc =
        this.currentUser.userPhotoDTOs[
          this.currentUser.userPhotoDTOs.length - 1
        ].imagePath
      return `https://${baseUrl()}${userPhotoSrc}`
    }
    return ''
  }

  get isModeView(): boolean {
    return this.mode === 'view'
  }

  get isModeEdit(): boolean {
    return this.mode === 'edit'
  }

  get isModeAdd(): boolean {
    return this.mode === 'add'
  }

  async deleteUser(): Promise<void> {
    const userId = this.currentUser.userId || this.$route.params.id
    if (!userId) return

    const res: AxiosResponse<ApiResult> = await user.delete(Number(userId))
    if (res.status === 200) {
      this.isDeleteModalOpen = false
      this.$router.push({
        name: 'users',
      })
    }
  }

  async setVehicleTypes(): Promise<void> {
    let response: AxiosResponse
    try {
      response = await type.vehicleTypeTableView({})
      const { data } = response
      this.vehicleTypes = data.resultList

      if (this.isModeAdd && this.currentUserAsDriver) {
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

  updateModels(newModel: UserDetailDriver): void {
    this.currentUserAsDriver = Object.assign(
      {},
      this.currentUserAsDriver,
      newModel
    )
  }

  // Not sure what type to cast the event as here
  uploadUserPhoto(e: any): void {
    e.preventDefault()
    if (!e.target.files || !e.target?.files[0]) return

    const file = e.target.files[0]
    this.avatarLink = URL.createObjectURL(file)
    const formData = new FormData()
    formData.append('file', file)
    this.uploadedPhoto = formData
  }

  // Start Submit Methods
  prepareModelForSubmit(): void {
    const { drugTestExpirationMonth: month, drugTestExpirationYear: year } =
      this.currentUserAsDriver
    if (month && year) {
      this.currentUserAsDriver.drugTestExpiration = dayjs(
        new Date(year, month - 1, 1)
      ).format('YYYY-MM-DD')
    } else {
      this.currentUserAsDriver.drugTestExpiration = undefined
    }

    this.currentUser.companyId = auth.getUser.companyId
    this.currentUser.companyName = auth.getUser.companyName
    this.currentUser.active = true
    this.currentUser.treatAsDriver = this.treatAsDriver
    this.currentUser.locale = 'en_US'

    this.currentUserAsDriver = Object.assign(
      {},
      this.currentUserAsDriver,
      this.currentUser
    )
  }

  // Return the user ID of the added user
  async addNewUser(): Promise<number> {
    const res = await user.checkIfEmailExists(this.currentUser.email)
    if (res.data.exists) {
      this.validationErrors.email = 'This email already exists.'
      return -1
    }
    if (this.treatAsDriver) {
      const newDriverResponse = await driver.create(
        this.currentUserAsDriver as UserDetailDriver
      )
      return newDriverResponse.data.driver.userId || 0
    } else {
      const newUserResponse = await user.create(this.currentUser as UserDetail)
      return newUserResponse.data
    }
  }

  async editExistingUser(): Promise<number> {
    const userId = Number(this.$route.params.id)

    if (this.treatAsDriver) {
      await driver.makeDriver(userId)
      await driver.update(userId, this.currentUserAsDriver as UserDetailDriver)
    } else {
      await driver.deactivateDriver(userId)
      await user.update(userId, this.currentUser as UserDetail)
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
    if (this.isModeAdd) {
      userId = await this.addNewUser()
    } else {
      userId = await this.editExistingUser()
    }

    if (this.uploadedPhoto) {
      user.uploadUserPhoto(userId, this.uploadedPhoto)
    }

    this.$router.push({
      name: 'users.view',
      params: { id: String(userId) },
    })
  }
}
</script>
