<template>
  <v-container>
    <v-row class="margin-t-15">
      <v-col sm="6">
        <h1
          class="font-medium marbin-b-5"
          :class="$vuetify.breakpoint.smAndUp ? `font-40` : `font-24`"
        >
          Reset Password
        </h1>
        <p class="margin-t-2">
          Enter the email address associated with your account, and we’ll email
          you a link to reset your password.
        </p>
        <br />
        <br />
        <v-form>
          <v-col sm="10" class="padding-a-0">
            <CUTextField
              type="email"
              v-model="email"
              :rules="[(val) => isNotEmpty(val) || 'This field is required']"
              label="E-mail address"
              class="font-14"
            />
          </v-col>
          <v-col v-if="success" sm="10" class="padding-a-0">
            <p class="text-success">
              If your account exists, your password reset email is on the way!
            </p>
          </v-col>
          <v-col sm="10" class="padding-a-0">
            <v-row align="center">
              <v-col>
                <v-row align="center">
                  <CUIcon
                    color="primary"
                    class="cursor-pointer"
                    @click="$router.push({ name: 'login' })"
                  >
                    arrow_left
                  </CUIcon>
                  <router-link to="/login" class="padding-l-2">
                    Back to Login
                  </router-link>
                </v-row>
              </v-col>
              <v-col>
                <v-btn
                  small
                  color="primary"
                  width="100%"
                  height="52"
                  class="font-20"
                  :loading="isSubmitting"
                  @click="submit"
                >
                  Submit
                  <template #loader>
                    <v-progress-circular indeterminate color="white" />
                  </template>
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-form>
      </v-col>
      <v-col v-if="$vuetify.breakpoint.smAndUp" sm="6">
        <img
          src="@/assets/images/WelcomeArtwork.png"
          class="h-448 margin-x-12 margin-t-auto"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import user from '@/services/user'
import { isNotEmpty } from '@/utils/validators'
@Component
export default class Login extends Vue {
  email = ''
  success = false
  isSubmitting = false
  isNotEmpty = isNotEmpty

  async submit(): Promise<void> {
    this.isSubmitting = true
    try {
      let res = await user.forgotPassword(this.email)
      this.isSubmitting = false
      if (res.data.successful) {
        this.success = true
      }
    } catch (error) {
      this.isSubmitting = false
      console.log(error)
    }
  }
}
</script>
