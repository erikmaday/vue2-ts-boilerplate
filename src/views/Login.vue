<template>
  <Guest>
    <v-container>
      <v-row class="margin-t-15">
        <v-col sm="6">
          <h1
            class="font-medium marbin-b-5"
            :class="$vuetify.breakpoint.smAndUp ? `font-40` : `font-24`"
          >
            Operator Login
          </h1>
          <p class="margin-t-2">
            Login to your CharterUP for Operators account to view marketplace
            bids, bookings, referrals and more.
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
                @keyup.enter="submit"
              />
            </v-col>
            <v-col sm="10" class="padding-a-0 font-14">
              <v-row no-gutters>
                <label for="password">Password</label>
                <v-spacer />
                <router-link
                  :to="{ name: 'forgot-password' }"
                  class="btn-forgot-password text-small font-14"
                  right
                  tabindex="3"
                >
                  Forgot?
                </router-link>
              </v-row>
              <CUTextField
                type="password"
                :rules="[(val) => isNotEmpty(val) || 'This field is required']"
                v-model="password"
                name="password"
                @keyup.enter="submit"
              />
            </v-col>
            <v-col v-if="error" sm="10" class="padding-a-0">
              <p class="text-error">The username or password is not correct.</p>
            </v-col>
            <v-col sm="10" class="padding-a-0 margin-t-5">
              <v-btn
                small
                color="primary"
                width="100%"
                height="52"
                class="font-20"
                :loading="isSubmitting"
                @click="submit"
              >
                Login
              </v-btn>
            </v-col>
          </v-form>
        </v-col>
        <v-col v-if="$vuetify.breakpoint.smAndUp" sm="6">
          <img
            src="@/assets/images/WelcomeArtwork.png"
            class="h-556 margin-x-12 margin-t-auto"
          />
        </v-col>
      </v-row>
    </v-container>
  </Guest>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import modules from '@/store/modules'
import { isNotEmpty } from '@/utils/validators'
import Guest from '@/layouts/Guest.vue'
@Component({ components: { Guest } })
export default class Login extends Vue {
  email = ''
  password = ''
  isSubmitting = false
  error = false
  isNotEmpty = isNotEmpty

  mounted(): void {
    if (modules.auth.getIsTokenSet) {
      this.$router.push({ name: 'home' })
    }
  }

  async submit(): Promise<void> {
    this.isSubmitting = true
    try {
      await modules.auth.login({ email: this.email, password: this.password })
      await modules.auth.getUserProfile()
      await modules.auth.getUserDetail()
      this.isSubmitting = false
    } catch (error) {
      this.isSubmitting = false
      this.error = true
      return
    }
    this.$router.push({ name: 'today' })
  }
}
</script>
