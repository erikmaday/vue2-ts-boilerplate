<template>
  <div>
<<<<<<< HEAD
    <component :is="currentComponent" />
=======
    <h1>Garages</h1>
>>>>>>> CUPOPS-24
  </div>
</template>

<script lang="ts">
import { Component as VueComponent } from 'vue'
import CompanyGaragesList from '@/components/CompanyGaragesList.vue'
import { Vue, Component } from 'vue-property-decorator'
import CompanyGaragesEdit from './CompanyGaragesEdit.vue'

@Component({
  components: { CompanyGaragesList },
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

