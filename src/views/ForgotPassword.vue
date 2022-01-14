<template>
  <Guest>
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
            Enter the email address associated with your account, and we’ll
            email you a link to reset your password.
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
            <v-col v-if="success && isSubmitted" sm="10" class="padding-a-0">
              <p class="text-success">
                Your password reset email is on the way!
              </p>
            </v-col>
            <v-col
              v-if="!success && email.length > 0 && isSubmitted"
              sm="10"
              class="padding-a-0"
            >
              <p class="text-error">
                This email is not associated with a valid account.
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
                    <router-link :to="{ name: 'login' }" class="padding-l-2">
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
  </Guest>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import user from '@/services/user'
import { isNotEmpty } from '@/utils/validators'
import Guest from '@/layouts/Guest.vue'

@Component({ components: { Guest } })
export default class ForgotPassword extends Vue {
  email = ''
  success = false
  isSubmitting = false
  isSubmitted = false
  isNotEmpty = isNotEmpty

  @Watch('email', { deep: true })
  emailChanged(): void {
    this.isSubmitted = false
  }

  async submit(): Promise<void> {
    this.isSubmitting = true
    this.isSubmitted = true
    try {
      let res = await user.forgotPassword(this.email)
      this.isSubmitting = false
      if (res.data.successful) {
        this.success = true
      }
    } catch (error) {
      this.success = false
      this.isSubmitting = false
    }
  }
}
</script>
