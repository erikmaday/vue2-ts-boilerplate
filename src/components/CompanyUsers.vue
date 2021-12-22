<template>
  <Main>
    <component :is="currentComponent" />
  </Main>
</template>

<script lang="ts">
import { Component as VueComponent } from 'vue'
import CompanyUsersList from '@/components/CompanyUsersList.vue'
import CompanyUsersDetail from '@/components/CompanyUsersDetail.vue'
import Main from '@/layouts/Main.vue'
import { Vue, Component } from 'vue-property-decorator'

@Component({
  components: { CompanyUsersList, CompanyUsersDetail, Main },
})
export default class CompanyUsers extends Vue {
  get currentComponent(): VueComponent {
    switch (this.$route.name) {
      case 'users.edit':
      case 'users.view':
      case 'users.add':
        return CompanyUsersDetail
      default:
        return CompanyUsersList
    }
  }
}
</script>
