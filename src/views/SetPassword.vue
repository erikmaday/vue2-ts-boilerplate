<template>
  <MainWithSidebar :sidebar-width="404">
    <template v-slot:navigation>
      <v-container class="background-white padding-x-2 padding-t-12">
        <v-col class="padding-x-0" align="center">
          <BusJoinUs class="w-220 margin-b-9" />
          <h1 class="margin-b-5 font-28 text-left">
            Grow and expand your business with CharterUP.
          </h1>
          <p class="margin-b-8 font-18 text-left">
            CharterUP is the largest marketplace of charter buses in North
            America.
          </p>
          <v-row class="align-center">
            <v-col class="shrink">
              <GetCash height="35px" width="35px" />
            </v-col>
            <v-col class="shrink white-space-nowrap padding-l-0 font-medium">
              Automated lead pricing
            </v-col>
          </v-row>
          <v-row class="align-center">
            <v-col class="shrink">
              <InProgressYellow height="35px" width="35px" />
            </v-col>
            <v-col class="shrink white-space-nowrap padding-l-0 font-medium">
              Real-time availability control
            </v-col>
          </v-row>
          <v-row class="align-center">
            <v-col class="shrink">
              <InProgress height="35px" width="35px" />
            </v-col>
            <v-col class="shrink white-space-nowrap padding-l-0 font-medium">
              Driver and vehicle management
            </v-col>
          </v-row>
          <v-row class="align-center">
            <v-col class="shrink">
              <LocationMarker height="35px" width="35px" />
            </v-col>
            <v-col class="shrink white-space-nowrap padding-l-0 font-medium">
              ELD integration supported
            </v-col>
          </v-row>
        </v-col>
      </v-container>
    </template>
    <template v-slot:default>
      <v-container class="background-gray-header">
        <v-col cols="12" align="center" class="margin-b-8">
          <h1 class="font-30">CharterUP for Operators</h1>
          <p class="font-18">
            Create a password to continue setting up your account
          </p>
        </v-col>
        <v-form
          ref="form"
          class="
            background-white
            max-w-536
            margin-x-auto margin-y-8
            padding-x-15 padding-y-10
            border-solid border-1 border-gray-border border-radius-5
            shadow
          "
        >
          <v-row justify="center">
            <v-col sm="10" class="padding-a-0">
              <CUTextField
                type="email"
                :disabled="true"
                v-model="email"
                label="Email address"
                class="font-14"
              />
            </v-col>
            <v-col sm="10" class="padding-a-0">
              <CUTextField
                type="password"
                :rules="[(val) => isNotEmpty(val) || 'This field is required']"
                v-model="newPassword"
                label="Create password"
                class="font-14"
              />
            </v-col>
            <v-col sm="10" class="padding-a-0">
              <CUTextField
                type="password"
                v-model="confirmPassword"
                label="Confirm password"
                class="font-14"
                :rules="[
                  (val) => passwordsMatch(val) || 'Passwords must match',
                  (val) => isNotEmpty(val) || 'This field is required',
                ]"
                validate-on-blur
              />
            </v-col>
            <v-col sm="10" class="padding-a-0" align="center">
              <v-btn
                small
                color="primary"
                width="100%"
                class="margin-b-11"
                :loading="loading"
                @click="setPassword"
              >
                Continue
              </v-btn>
              <br />
              <v-divider />
              <p class="margin-t-6 font-14">
                Already have an account?
                <router-link :to="{ name: 'login' }">Login</router-link>
              </p>
            </v-col>
          </v-row>
        </v-form>
      </v-container>
    </template>
  </MainWithSidebar>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { isNotEmpty } from '@/utils/validators'
import user from '@/services/user'
import MainWithSidebar from '@/layouts/MainWithSidebar.vue'
import BusJoinUs from '@/assets/images/BusJoinUs.vue'
import LocationMarker from '@/assets/images/LocationMarker.vue'
import InProgress from '@/assets/images/InProgress.vue'
import GetCash from '@/assets/images/GetCash.vue'
import InProgressYellow from '@/assets/images/InProgressYellow.vue'

@Component({
  components: {
    MainWithSidebar,
    BusJoinUs,
    LocationMarker,
    InProgress,
    GetCash,
    InProgressYellow,
  },
})
export default class SetPassword extends Vue {
  @Prop({
    required: true,
  })
  hash!: string

  email = ''
  newPassword = ''
  confirmPassword = ''
  loading = false
  isNotEmpty = isNotEmpty

  async created(): Promise<void> {
    try {
      let res = await user.validateUser(this.hash)
      this.email = res.data.email
    } catch (e) {
      console.log(e)
    }
  }

  passwordsMatch(password: string): boolean {
    return password === this.newPassword
  }

  async setPassword(): Promise<void> {
    this.loading = true
    const form: any = this.$refs['form']
    if (!form.validate()) {
      this.loading = false
      return
    }

    try {
      await user.setPasswordWithHash(this.hash, this.newPassword)
    } catch (e) {
      this.loading = false
      console.log(e)
      return
    }
    this.newPassword = ''
    this.confirmPassword = ''
    this.loading = false
    this.$router.push({ name: 'today' })
  }
}
</script>
