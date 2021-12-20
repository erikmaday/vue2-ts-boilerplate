<template>
  <v-card :width="500">
    <v-card-title>Change Password</v-card-title>
    <v-card-text style="width: 500px" class="padding-x-6">
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
import CUTextField from '@/components/CUTextField.vue'
import { User } from '@/models/dto/User'
import user from '@/services/user'

@Component({
  components: { CUTextField },
})
export default class CompanyUsersEdit extends Vue {
  @Prop({
    required: true,
  })
  user!: User

  newPassword = ''
  confirmPassword = ''

  async updatePassword(): Promise<void> {
    if (!this.$refs['form'].validate()) return

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

<style></style>
