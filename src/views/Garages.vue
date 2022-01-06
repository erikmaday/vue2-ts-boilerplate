<template>
  <Main>
    <component :is="currentComponent" />
  </Main>
</template>

<script lang="ts">
import { Component as VueComponent } from 'vue'
import GaragesList from '@/views/GaragesList.vue'
import { Vue, Component } from 'vue-property-decorator'
import GaragesDetail from '@/views/GaragesDetail.vue'
import Main from '@/layouts/Main.vue'

@Component({
  components: { Main },
})
export default class Garages extends Vue {
  get currentComponent(): VueComponent {
    switch (this.$route.name) {
      case 'garages.add':
      case 'garages.view':
      case 'garages.edit':
        return GaragesDetail
      default:
        return GaragesList
    }
  }
}
</script>
