<template>
  <TripAssignmentIcon
    :image-source="image"
    icon-name="person"
    :more-required-count="moreRequiredCount"
    :no-image-available="noImageAvailable"
  />
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import TripAssignmentIcon from '@/components/TripAssignmentIcon.vue'
import { DriverAssignment } from '@/models/dto'
import { baseUrl } from '@/utils/env'

@Component({
  components: {
    TripAssignmentIcon,
  },
})
export default class DriverAssignmentIcon extends Vue {
  @Prop({ required: false }) readonly driverAssignment?: DriverAssignment
  @Prop({ required: false, default: 0 }) readonly moreRequiredCount?: number

  get image(): string | null {
    const driverImageUri = this.driverAssignment?.driver?.imagePath
    if (driverImageUri) {
      const host = baseUrl()
      return `http://${host}${driverImageUri}`
    }
    return null
  }

  get noImageAvailable(): boolean {
    return this.driverAssignment && !this.image
  }
}
</script>
