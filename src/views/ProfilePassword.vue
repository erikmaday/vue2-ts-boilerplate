<template>
  <v-row no-gutters>
    <v-col cols="12">
      <v-form ref="changePasswordForm">
        <CUTextField
          label="Old Password"
          id="my-profile-password-text-old-password"
          v-model="formFields.oldPassword"
          :error-messages="oldPasswordErrors"
          :rules="[(v) => !!v || 'Old password is required']"
          type="password"
          required
          outlined
        />
        <CUTextField
          label="New Password"
          id="my-profile-password-text-new-password"
          v-model="formFields.newPassword"
          :rules="[
            (v) => !!v || 'Please enter a new password',
            (v) =>
              v.length >= 8 || 'New password must be at least 8 characters',
          ]"
          type="password"
          required
          outlined
        />
        <CUTextField
          label="Confirm New Password"
          id="my-profile-password-text-confirm-new-password"
          v-model="formFields.confirmNewPassword"
          :rules="[
            (v) => !!v || 'Please confirm your password',
            (v) =>
              v === this.formFields.newPassword || 'New passwords must match',
          ]"
          type="password"
          required
          outlined
        />
        <div class="d-flex justify-end">
          <v-btn
            text
            small
            color="primary"
            @click="$router.push({ name: 'profile' })"
          >
            Cancel
          </v-btn>
          <v-btn
            small
            color="primary"
            :disabled="loading || disabled"
            @click="submit"
          >
            <template v-if="!loading">Change Password</template>
            <span v-else class="padding-x-3">
              <v-progress-circular
                :size="10"
                :width="2"
                color="white"
                indeterminate
              />
            </span>
          </v-btn>
        </div>
      </v-form>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import user from '@/services/user'
import { Vue, Component, Watch } from 'vue-property-decorator'
import auth from '@/store/modules/auth'

@Component({})
export default class ProfilePassword extends Vue {
  formFields: Record<string, string> = {
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  }
  loading = false
  disabled = false

  oldPasswordErrors = ''

  @Watch('formFields', { deep: true })
  onFormUpdate(): void {
    this.oldPasswordErrors = ''
    this.disabled = false
  }

  async submit(): Promise<void> {
    this.loading = true
    const form: any = this.$refs['changePasswordForm']

    if (!form.validate()) {
      return
    }

    user
      .changePassword(
        auth.getUserId,
        this.formFields.newPassword,
        this.formFields.oldPassword
      )
      .then(() => this.$router.push({ name: 'profile' }))
      .catch((error) => {
        this.disabled = true
        this.oldPasswordErrors = error.response.data.description
      })

    this.loading = false
  }
}
</script>

<style lang="scss" scoped>
.v-btn {
  transition: all 0.25s ease;
}
</style>
