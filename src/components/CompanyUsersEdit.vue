<template>
  <div>
    <v-container>
      <h1 class="padding-b-5">Edit User</h1>
      <v-form>
        <v-row>
          <v-col cols="4">
            <div class="user-photo">
              <div class="user-photo__src">
                <img
                  v-if="userPhoto !== ''"
                  class="h-full w-full"
                  :src="userPhoto"
                />
              </div>
              <div class="user-photo__upload-group">
                <button class="user-photo__upload-btn" @click="uploadFile">
                  <CUIcon color="white" width="24px" height="24px">
                    upload
                  </CUIcon>
                </button>
                <input type="file" accept="image/*" />
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
            <v-col
              v-show="isUserDriver"
              class="background-gray-lighter border-radius-5 padding-a-5"
            >
              <v-row>
                <v-col cols="6">
                  <CUTextField label="Drug Test #" />
                </v-col>
                <v-col cols="3">
                  <CUSelect
                    label="Exp. Month"
                    item-text="short"
                    item-key="number"
                    :items="months"
                  />
                </v-col>
                <v-col cols="3">
                  <CUSelect label="Exp. Year" />
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
                  <CUSelect label="State" :items="states" />
                </v-col>
                <v-col cols="3" class="padding-t-0">
                  <CUSelect
                    label="Exp. Month"
                    item-text="short"
                    item-key="number"
                    :items="months"
                  />
                </v-col>
                <v-col cols="3" class="padding-t-0">
                  <CUSelect label="Exp. Year" />
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
                  <v-textarea label="Notes" outlined flat solo />
                </v-col>
              </v-row>
            </v-col>
            <v-row>
              <v-col>
                <v-btn small color="primary">Add User</v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-form>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import user from '@/services/user'
import { getVehicleTypes } from '@/services/type'
import { Driver, Group } from '@/models/dto'
import { AxiosResponse } from 'axios'
import CUTextField from '@/components/CUTextField.vue'
import CUSelect from '@/components/CUSelect.vue'
import CUIcon from '@/components/CUIcon.vue'
import { states } from '@/utils/states'
import { months } from '@/utils/dates'
import { apiBaseUrl } from '@/utils/env'

@Component({
  components: { CUTextField, CUSelect, CUIcon },
})
export default class CompanyUsersEdit extends Vue {
  notFound = false
  states = states
  months = months

  currentUser: Partial<Driver> = {
    firstName: '',
    lastName: '',
    email: '',
    groupId: 1,
    userPhotoDTOs: [],
    licenseNumber: '',
  }

  isUserDriver = true
  vehicleTypes = []

  mounted(): void {
    this.getCurrentUser()
    this.setVehicleTypes()
  }

  async getCurrentUser(): Promise<void> {
    let response: AxiosResponse
    try {
      if (this.$route.params.id) {
        response = await user.byId(Number(this.$route.params.id))
        const { data } = response
        this.currentUser = data
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

  async setVehicleTypes(): Promise<void> {
    let response: AxiosResponse
    try {
      if (this.$route.params.id) {
        response = await getVehicleTypes({})
        const { data } = response
        this.vehicleTypes = data
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
    if (this.currentUser?.userPhotoDTOs?.length) {
      return `https://${apiBaseUrl(null)}${
        this.currentUser.userPhotoDTOs[0].imagePath
      }`
    }
    return ''
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
  right: 85px;
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
