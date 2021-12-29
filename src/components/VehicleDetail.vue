<template>
  <div>
    <!-- Placeholder for real view/edit page -->
    <h1>Edit Vehicle</h1>
    <h2 v-if="currentVehicle !== null">
      {{ `${currentVehicle.vehicleName}` }}
    </h2>
    <h2 v-else>Vehicle not found</h2>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import vehicle from '@/services/vehicle'
import { AxiosResponse } from 'axios'
import { Vehicle } from '@/models/dto/Vehicle'

@Component
export default class VehicleDetail extends Vue {
  notFound = false

  currentVehicle: Vehicle | null = null

  mounted(): void {
    this.getCurrentVehicle()
  }

  async getCurrentVehicle(): Promise<void> {
    let response: AxiosResponse
    try {
      if (this.$route.params.id) {
        response = await vehicle.byId(Number(this.$route.params.id))
        const { data } = response
        this.currentVehicle = data
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
