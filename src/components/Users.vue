<template>
  <Main>
    <component :is="currentComponent" />
  </Main>
</template>

<script lang="ts">
import { Component as VueComponent } from 'vue'
import UsersList from '@/components/UsersList.vue'
import UsersDetail from '@/components/UsersDetail.vue'
import Main from '@/layouts/Main.vue'
import { Vue, Component } from 'vue-property-decorator'

@Component({
  components: { UsersList, UsersDetail, Main },
})
export default class Users extends Vue {
  get currentComponent(): VueComponent {
    switch (this.$route.name) {
      case 'users.edit':
      case 'users.view':
      case 'users.add':
        return UsersDetail
      default:
        return UsersList
    }
  }
}
</script>
