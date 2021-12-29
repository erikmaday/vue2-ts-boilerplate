<template>
  <Main>
    <component :is="currentComponent" />
  </Main>
</template>

<script lang="ts">
import { Component as VueComponent } from 'vue'
import { Vue, Component } from 'vue-property-decorator'
import VehicleDetail from '@/components/VehicleDetail.vue'
import VehicleList from '@/components/VehicleList.vue'
import Main from '@/layouts/Main.vue'

@Component({
  components: { VehicleList, VehicleDetail, Main },
})
export default class CompanyUsers extends Vue {
  get currentComponent(): VueComponent {
    switch (this.$route.name) {
      case 'vehicles.add':
      case 'vehicles.view':
      case 'vehicles.edit':
        return VehicleDetail
      default:
        return VehicleList
    }
  }
}
</script>
