<template>
  <div>
    <h1>Edit User</h1>
    <h2 v-if="currentUser !== null">
      {{ `${currentUser.firstName} ${currentUser.lastName}` }}
    </h2>
    <h2 v-else>User not found</h2>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import users from '@/services/user'
import { User } from '@/models/dto'
import { AxiosResponse } from 'axios'

@Component
export default class CompanyUsersEdit extends Vue {
  notFound = false

  currentUser: User | null = null

  mounted(): void {
    this.getCurrentUser()
  }

  async getCurrentUser(): Promise<void> {
    let response: AxiosResponse
    try {
      if (this.$route.params.id) {
        response = await users.byId(Number(this.$route.params.id))
        const { data } = response
        this.currentUser = data
      } else {
        this.notFound = true
        return
      }
    } catch (e) {
      this.notFound = true
      console.error(e)
      return
    }
  }
}
</script>