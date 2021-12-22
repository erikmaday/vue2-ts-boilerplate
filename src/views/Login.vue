<template>
  <v-container>
    <v-form ref="form">
      <v-row>
        <v-col cols="12">
          <h1 class="text-center">CharterUP for Operators</h1>
        </v-col>
        <v-col sm="6" offset-sm="3">
          <v-text-field
            outlined
            v-model="email"
            label="E-mail"
            @keyup.enter="submit"
          ></v-text-field>
        </v-col>
        <v-col sm="6" offset-sm="3">
          <v-text-field
            outlined
            v-model="password"
            type="password"
            label="Password"
            @keyup.enter="submit"
          ></v-text-field>
        </v-col>
        <v-col sm="6" offset-sm="3">
          <v-btn
            color="primary"
            class="mr-4 w-full"
            @click="submit"
            :loading="isSubmitting"
          >
            Login
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import modules from '@/store/modules'
@Component
export default class Login extends Vue {
  email = ''
  password = ''
  isSubmitting = false

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
      await modules.auth.getUserV2()
      this.isSubmitting = false
    } catch (error) {
      this.isSubmitting = false
      return
    }
    this.$router.push({ name: 'today' })
  }
}
</script>
