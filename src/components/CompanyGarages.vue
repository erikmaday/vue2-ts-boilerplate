<template>
  <Main>
    <component :is="currentComponent" />
  </Main>
</template>

<script lang="ts">
import { Component as VueComponent } from 'vue'
import CompanyGaragesList from '@/components/CompanyGaragesList.vue'
import { Vue, Component } from 'vue-property-decorator'
import CompanyGaragesDetail from './CompanyGaragesDetail.vue'
import Main from '@/layouts/Main.vue'

@Component({
  components: { Main },
})
export default class CompanyUsers extends Vue {
  get currentComponent(): VueComponent {
    switch (this.$route.name) {
      case 'garages.add':
      case 'garages.view':
      case 'garages.edit':
        return CompanyGaragesDetail
      default:
        return CompanyGaragesList
    }
  }
}
</script>

