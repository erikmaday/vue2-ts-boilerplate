<template>
  <div>
    <component :is="currentComponent" />
  </div>
</template>

<script lang="ts">
import { Component as VueComponent } from 'vue'
import CompanyUsersList from '@/components/CompanyUsersList.vue'
import CompanyUsersEdit from '@/components/CompanyUsersEdit.vue'
import { Vue, Component } from 'vue-property-decorator'

@Component({
  components: { CompanyUsersList, CompanyUsersEdit },
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
