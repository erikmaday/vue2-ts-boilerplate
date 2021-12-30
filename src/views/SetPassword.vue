<template>
  <v-container>
    <v-form ref="form">
      <v-row>
        <v-col cols="12">
          <h1 class="text-center">Set Password</h1>
        </v-col>
        <v-col sm="6" offset-sm="3">
          <CUTextField
            type="password"
            :rules="[(val) => isNotEmpty(val) || 'This field is required']"
            v-model="newPassword"
            label="New Password"
          />
        </v-col>
        <v-col sm="6" offset-sm="3">
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
        <v-col sm="6" offset-sm="3">
          <v-row justify="center">
            <v-btn
              class="margin-b-3"
              small
              outlined
              color="primary"
              @click="$router.push({ name: 'login' })"
            >
              Cancel
            </v-btn>
            <v-btn
              class="margin-b-3 margin-l-3"
              small
              color="primary"
              :loading="loading"
              @click="setPassword"
            >
              Set Password
            </v-btn>
          </v-row>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { isNotEmpty } from '@/utils/validators'
import user from '@/services/user'
import modules from '@/store/modules'

@Component
export default class SetPassword extends Vue {
  @Prop({
    required: true,
  })
  hash!: string

  newPassword = ''
  confirmPassword = ''
  loading = false
  isNotEmpty = isNotEmpty

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
