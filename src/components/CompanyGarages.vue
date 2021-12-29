<template>
  <Main>
    <component :is="currentComponent" />
  </Main>
</template>

<script lang="ts">
import { Component as VueComponent } from 'vue'
import { Vue, Component } from 'vue-property-decorator'
import CompanyGaragesList from '@/components/CompanyGaragesList.vue'
import CompanyGaragesEdit from '@/components/CompanyGaragesEdit.vue'
import Main from '@/layouts/Main.vue'

@Component({
  components: { Main },
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
