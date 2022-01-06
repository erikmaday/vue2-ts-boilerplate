<template>
  <Main>
    <component :is="currentComponent" />
  </Main>
</template>

<script lang="ts">
import { Component as VueComponent } from 'vue'
import { Vue, Component } from 'vue-property-decorator'
import VehicleDetail from '@/components/VehicleDetail.vue'
import VehiclesList from '@/components/VehiclesList.vue'
import Main from '@/layouts/Main.vue'

@Component({
  components: { VehiclesList, VehicleDetail, Main },
})
export default class Vehicles extends Vue {
  get currentComponent(): VueComponent {
    switch (this.$route.name) {
      case 'vehicles.add':
      case 'vehicles.view':
      case 'vehicles.edit':
        return VehicleDetail
      default:
        return VehiclesList
    }
  }
}
</script>
