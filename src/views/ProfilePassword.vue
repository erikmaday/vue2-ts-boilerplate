<template>
  <v-row no-gutters>
    <v-col cols="12">
      <span v-if="error">Please correct errors and submit again</span>
      <v-form ref="changePasswordForm" v-model="valid" :lazy-validation="true">
        <CUTextField
          label="Old Password"
          id="my-profile-password-text-old-password"
          v-model="formFields.oldPassword"
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
            (v) => !!v || 'New password is required',
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
            (v) => !!v || 'Confirm new password is required',
            (v) =>
              v === this.formFields.newPassword || 'New passwords must match',
          ]"
          type="password"
          required
          outlined
        />
      </v-form>
    </v-col>
    <v-btn
      medium
      :disabled="disabled"
      :color="submitButtonOptions.color"
      :loading="submitting"
      class="min-w-232 text-white"
      @click="submit"
    >
      {{ submitButtonOptions.text }}
    </v-btn>
  </v-row>
</template>

<script lang="ts">
import user from '@/services/user'
import { Vue, Component, Watch } from 'vue-property-decorator'
import auth from '@/store/modules/auth'
import { ColoredMessage } from '@/models/ColoredMessage'

@Component({})
export default class ProfilePassword extends Vue {
  valid = false
  formFields: Record<string, string> = {
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  }
  rules = []
  success = false
  error = false
  submitting = false
  disabled = true

  get submitButtonOptions(): ColoredMessage {
    const color = this.success ? 'success' : this.error ? 'error' : 'primary'
    const text = this.success
      ? 'Password Changed!'
      : this.error
      ? 'Error Changing Password'
      : 'Change Password'
    return {
      color: color,
      text: text,
    }
  }
  @Watch('formFields', { deep: true })
  formFieldsChanged(): void {
    this.success = false
    this.error = false
    this.disabled = this.isDisabled()
  }

  isDisabled(): boolean {
    return !(
      this.formFields.oldPassword &&
      this.formFields.newPassword &&
      this.formFields.confirmNewPassword
    )
  }
  submit(): void {
    this.$nextTick(async () => {
      const form: any = this.$refs['changePasswordForm']
      this.valid = form.validate()
      if (this.valid) {
        try {
          this.error = false
          this.submitting = true
          await user.changePassword(
            auth.getUserId,
            this.formFields.newPassword,
            this.formFields.oldPassword
          )
          this.success = true
        } catch {
          this.error = true
        }
      } else {
        this.error = true
      }
      this.submitting = false
    })
  }
}
</script>

<style lang="scss" scoped>
.v-btn {
  transition: all 0.25s ease;
}
::v-deep .v-progress-circular {
  color: white !important;
}
</style>
