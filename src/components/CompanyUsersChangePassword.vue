<template>
  <v-card :width="$vuetify.breakpoint.smAndUp ? 500 : 335">
    <v-card-title>Change Password</v-card-title>
    <v-card-text class="padding-x-6">
      <v-form ref="form">
        <CUTextField v-model="newPassword" label="New Password" />
        <CUTextField
          v-model="confirmPassword"
          label="Confirm New Password"
          :rules="[(val) => passwordsMatch(val) || 'Passwords must match']"
          validate-on-blur
        />
    </v-form>
    </v-card-text>
    <v-card-actions>
      <v-btn class="margin-b-3" small color="primary" @click="updatePassword">Update Password</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { UserDetail } from '@/models/dto/User'
import user from '@/services/user'

@Component
export default class CompanyUsersEdit extends Vue {
  @Prop({
    required: true,
  })
  user!: UserDetail

  newPassword = ''
  confirmPassword = ''

  async updatePassword(): Promise<void> {
    const form: any = this.$refs['form']
    if (!form.validate()) return

    this.$emit('close')
    await user.setPassword(this.user.userId, this.newPassword)
    this.newPassword = ''
    this.confirmPassword = ''
  }

  passwordsMatch(password: string): boolean {
    return password === this.newPassword
  }
}
</script>
