<template>
  <MainWithSidebar :sidebar-width="400">
    <template v-slot:navigation>
      <v-container class="background-white">
        <v-col>
          <h1 class="margin-b-5 font-30">
            Grow your business with the help of CharterUP!
          </h1>
          <p class="font-18">
            CharterUP is the largest marketplace of charter buses in North
            America.
          </p>
        </v-col>
      </v-container>
    </template>
    <template v-slot:default>
      <v-container class="background-gray-header">
        <v-col cols="12" align="center" class="margin-b-8">
          <h1>Welcome to CharterUP For Operators!</h1>
          <p>Set a password to continue to your quote</p>
        </v-col>
        <v-form
          ref="form"
          class="
            background-white
            margin-y-8
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
                label="Email"
              />
            </v-col>
            <v-col sm="10" class="padding-a-0">
              <CUTextField
                type="password"
                :rules="[(val) => isNotEmpty(val) || 'This field is required']"
                v-model="newPassword"
                label="New Password"
              />
            </v-col>
            <v-col sm="10" class="padding-a-0">
              <CUTextField
                type="password"
                v-model="confirmPassword"
                label="Confirm New Password"
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

@Component({ components: { MainWithSidebar } })
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
