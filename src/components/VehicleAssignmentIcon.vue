<template>
  <TripAssignmentIcon
    :image-source="image"
    icon-name="directions_bus"
    :more-required-count="moreRequiredCount"
    :no-image-available="noImageAvailable"
  />
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import TripAssignmentIcon from '@/components/TripAssignmentIcon.vue'
import { VehicleAssignment } from '@/models/dto/VehicleAssignment'
import { baseUrl } from '@/utils/env'

@Component({
  components: {
    TripAssignmentIcon,
  },
})
export default class VehicleAssignmentIcon extends Vue {
  @Prop({ required: false }) readonly vehicleAssignment?: VehicleAssignment
  @Prop({ required: false, default: 0 }) readonly moreRequiredCount?: number

  get image(): string | null {
    const vehicleImageUri = this.vehicleAssignment?.vehicle?.imagePath
    if (vehicleImageUri) {
      const host = baseUrl()
      return `http://${host}${vehicleImageUri}`
    }
    return null
  }

  get noImageAvailable(): boolean {
    return this.vehicleAssignment && !this.image
  }
}
</script>
