<template>
  <CUModal v-model="value" @input="(e) => $emit('input', e)">
    <template #title>Change Password</template>
    <template #text>
      <v-form ref="form">
        <CUTextField
          :rules="[(val) => isNotEmpty(val) || 'This field is required']"
          v-model="newPassword"
          label="New Password"
        />
        <CUTextField
          v-model="confirmPassword"
          label="Confirm New Password"
          :rules="[
            (val) => passwordsMatch(val) || 'Passwords must match',
            (val) => isNotEmpty(val) || 'This field is required',
          ]"
          validate-on-blur
        />
      </v-form>
    </template>
    <template #actions>
      <v-spacer />
      <v-btn
        class="margin-b-3"
        small
        outlined
        color="primary"
        @click="$emit('input', false)"
      >
        Cancel
      </v-btn>
      <v-btn class="margin-b-3" small color="primary" @click="updatePassword">
        Update Password
      </v-btn>
      <v-spacer />
    </template>
  </CUModal>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { isNotEmpty } from '@/utils/validators'
import user from '@/services/user'

@Component
export default class UsersChangePassword extends Vue {
  @Prop({
    required: true,
  })
  userId!: number

  @Prop({
    required: true,
  })
  value!: boolean

  newPassword = ''
  confirmPassword = ''
  isNotEmpty = isNotEmpty

  async updatePassword(): Promise<void> {
    const form: any = this.$refs['form']
    if (!form.validate()) return
    if (!this.userId) return

    await user.setPassword(this.userId, this.newPassword)
    this.newPassword = ''
    this.confirmPassword = ''
    this.$emit('input', false)
    form.reset()
  }

  passwordsMatch(password: string): boolean {
    return password === this.newPassword
  }
}
</script>
