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
        :disabled="isModeView"
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
import { Component, Model, Prop, Vue, Watch } from 'vue-property-decorator'

@Component
export default class VehicleDetailAmenities extends Vue {
  @Model('change') readonly vehicleAmenities!: VehicleAmenityDTO[]
  @Prop({ required: true, type: Boolean }) readonly isModeView!: boolean
  @Prop({ required: true, type: Boolean }) readonly isModeAdd!: boolean

  vehicleAmenityDTOs: VehicleAmenityDTO[] = []

  @Watch('vehicleAmenityDTOs', { deep: true })
  amenitiesChanged(value: VehicleAmenityDTO[]): void {
    this.$emit('change', value)
  }

  @Watch('vehicleAmenities', { deep: true })
  parentaAmenitiesChanged(value: VehicleAmenityDTO[]): void {
    this.vehicleAmenityDTOs = value
  }

  mounted(): void {
    if (this.isModeAdd) {
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
