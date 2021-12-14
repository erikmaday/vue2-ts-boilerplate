<template>
  <Main>
    <component :is="currentComponent" />
  </Main>
</template>

<script lang="ts">
import { Component as VueComponent } from 'vue'
import CompanyGaragesList from '@/components/CompanyGaragesList.vue'
import { Vue, Component } from 'vue-property-decorator'
import CompanyGaragesEdit from './CompanyGaragesEdit.vue'
import Main from '@/layouts/Main.vue'

@Component({
  components: { CompanyGaragesList, Main },
})
export default class CompanyUsers extends Vue {
  get currentComponent(): VueComponent {
    switch (this.$route.name) {
      case 'garages.edit':
        return CompanyGaragesEdit
      default:
        return CompanyGaragesList
    }
  }
}
</script>

