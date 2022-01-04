<template>
  <Main>
    <component :is="currentComponent" />
  </Main>
</template>

<script lang="ts">
import { Component as VueComponent } from 'vue'
import VehiclesList from '@/components/VehiclesList.vue'
import { Vue, Component } from 'vue-property-decorator'
import VehiclesEdit from './VehiclesEdit.vue'
import Main from '@/layouts/Main.vue'

@Component({
  components: { VehiclesList, VehiclesEdit, Main },
})
export default class Users extends Vue {
  get currentComponent(): VueComponent {
    switch (this.$route.name) {
      case 'vehicles.edit':
        return VehiclesEdit
      default:
        return VehiclesList
    }
  }
}
</script>
