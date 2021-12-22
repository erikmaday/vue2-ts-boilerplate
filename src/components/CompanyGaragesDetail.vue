<template>
  <div>
    <!-- Placeholder for real view/edit page -->
    <h1>Edit Garage</h1>
    <h2 v-if="currentGarage !== null">
      {{ `${currentGarage.garageName}` }}
    </h2>
    <h2 v-else>Garage not found</h2>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import garage from '@/services/garage'
import { AxiosResponse } from 'axios'
import { Garage } from '@/models/dto/Garage'

@Component
export default class CompanyGaragesEdit extends Vue {
  notFound = false

  currentGarage: Garage | null = null

  mounted(): void {
    this.getCurrentGarage()
  }

  async getCurrentGarage(): Promise<void> {
    let response: AxiosResponse
    try {
      if (this.$route.params.id) {
        response = await garage.byId(Number(this.$route.params.id))
        const { data } = response
        this.currentGarage = data
      } else {
        this.notFound = true
        return
      }
    } catch (e) {
      this.notFound = true
      console.error(e)
      return
    }
  }
}
</script>