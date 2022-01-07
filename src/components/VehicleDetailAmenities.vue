<template>
  <v-row wrap>
    <v-col cols="12" class="padding-t-0">
      <h3>Amenities</h3>
    </v-col>
    <v-col
      v-for="(amenity, amenityIndex) in vehicleAmenityDTOs"
      cols="6"
      class="padding-y-0"
      :key="`amenity-${amenity.amenityId}-${amenityIndex}`"
    >
      <v-checkbox
        v-model="amenity.isSupported"
        :disabled="disabled"
        :label="amenity.amenityName"
        hide-details
        class="margin-t-2"
      />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { VehicleAmenityDTO } from '@/models/dto'
import { AmenityType } from '@/models/dto/Amenity'
import type from '@/services/type'
import vehicleDetail from '@/store/modules/vehicleDetail'
import { Component, Vue, Watch } from 'vue-property-decorator'

@Component
export default class VehicleDetailAmenities extends Vue {
  vehicleAmenityDTOs: VehicleAmenityDTO[] = []

  @Watch('vehicleAmenityDTOs', { deep: true })
  amenitiesChanged(value: VehicleAmenityDTO[]): void {
    vehicleDetail.setAmenities(value)
  }

  @Watch('vehicleAmenities', { deep: true })
  parentAmenitiesChanged(value: VehicleAmenityDTO[]): void {
    this.vehicleAmenityDTOs = value
  }

  get vehicleAmenities(): VehicleAmenityDTO[] {
    return vehicleDetail.getVehicle.vehicleAmenityDTOs
  }

  get disabled(): boolean {
    return vehicleDetail.getIsModeView
  }

  mounted(): void {
    if (vehicleDetail.getIsModeAdd) {
      this.getAmenityTypes()
    }
  }

  async getAmenityTypes(): Promise<void> {
    const response = await type.amenity({ pageSize: -1 })
    const amenities = response.data.resultList.filter(
      (amenity) => !['CDC Compliant', 'DOD Compliant'].includes(amenity.label)
    )
    this.vehicleAmenityDTOs = this.mapAmenities(amenities)
  }

  mapAmenities(amenities: AmenityType[]): VehicleAmenityDTO[] {
    return amenities.map((amenity) => {
      return {
        isSupported: false,
        amenityId: amenity.id,
        amenityName: amenity.label,
      }
    })
  }
}
</script>
