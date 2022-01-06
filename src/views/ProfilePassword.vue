<template>
  <v-form ref="form" v-model="valid" lazy-validation>
    <v-row no-gutters>
      <v-col cols="12">
        <span v-if="error" style="color: red">
          Please correct errors and submit again
        </span>
        <v-form
          ref="changePasswordForm"
          v-model="valid"
          :lazy-validation="true"
        >
          <label>Old Password</label>
          <v-text-field
            id="my-profile-password-text-old-password"
            ref="oldPassword"
            v-model="formFields.oldPassword"
            :rules="[(v) => !!v || 'Old password is required']"
            type="password"
            required
            outlined
          />
          <label>New Password</label>
          <v-text-field
            id="my-profile-password-text-new-password"
            ref="newPassword"
            v-model="formFields.newPassword"
            :rules="[(v) => !!v || 'New password is required']"
            type="password"
            required
            outlined
          />
          <label>Confirm New Password</label>
          <v-text-field
            id="my-profile-password-text-confirm-new-password"
            ref="confirmNewPassword"
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
        style="min-width: 230px"
        :style="success || error ? 'color: white;' : ''"
        @click="submit"
      >
        {{ submitButtonOptions.text }}
      </v-btn>
    </v-row>
  </v-form>
</template>

<script lang="ts">
import user from '@/services/user'
import { Vue, Component, Watch } from 'vue-property-decorator'
import auth from '@/store/modules/auth'

@Component({})
export default class ProfilePassword extends Vue {
  valid = false
  formFields: Record<string, string> = {
    oldPassword: null,
    newPassword: null,
    confirmNewPassword: null,
  }
  rules = []
  success = false
  error = false
  submitting = false
  disabled = true

  get submitButtonOptions(): Record<string, string> {
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
    if (this.formFields.oldPassword === null || !this.formFields.oldPassword) {
      return true
    }
    if (this.formFields.newPassword === null || !this.formFields.newPassword) {
      return true
    }
    if (
      this.formFields.confirmNewPassword === null ||
      !this.formFields.confirmNewPassword
    ) {
      return true
    }
    return false
  }
  submit(): void {
    this.$nextTick(async () => {
      const form: any = this.$refs['form']
      form.validate()
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
