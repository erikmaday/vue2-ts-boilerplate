<template>
  <Main>
    <component :is="currentComponent" />
  </Main>
</template>

<script lang="ts">
import { Component as VueComponent } from 'vue'
import CompanyUsersList from '@/components/CompanyUsersList.vue'
import CompanyUsersEdit from '@/components/CompanyUsersEdit.vue'
import Main from '@/layouts/Main.vue'
import { Vue, Component } from 'vue-property-decorator'

@Component({
  components: { CompanyUsersList, CompanyUsersEdit, Main },
})
export default class CompanyUsers extends Vue {
  get currentComponent(): VueComponent {
    switch (this.$route.name) {
      case 'users.edit':
        return CompanyUsersEdit
      default:
        return CompanyUsersList
    }
  }
}
</script>
