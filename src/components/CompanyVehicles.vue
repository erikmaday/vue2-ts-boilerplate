<template>
  <Main>
    <component :is="currentComponent" />
  </Main>
</template>

<script lang="ts">
import { Component as VueComponent } from 'vue'
import CompanyVehiclesList from '@/components/CompanyVehiclesList.vue'
import { Vue, Component } from 'vue-property-decorator'
import CompanyVehiclesEdit from './CompanyVehiclesEdit.vue'
import Main from '@/layouts/Main.vue'

@Component({
  components: { CompanyVehiclesList, CompanyVehiclesEdit, Main },
})
export default class CompanyUsers extends Vue {
  get currentComponent(): VueComponent {
    switch (this.$route.name) {
      case 'vehicles.edit':
        return CompanyVehiclesEdit
      default:
        return CompanyVehiclesList
    }
  }
}
</script>
