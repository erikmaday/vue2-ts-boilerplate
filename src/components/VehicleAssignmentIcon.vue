<template>
  <TripAssignmentIcon
    :image-source="image"
    icon-name="directions_bus"
    :more-required-count="moreRequiredCount"
  />
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import TripAssignmentIcon from '@/components/TripAssignmentIcon.vue'
import { VehicleAssignment } from '@/models/dto/VehicleAssignment'

@Component({
  components: {
    TripAssignmentIcon,
  },
})
export default class VehicleAssignmentIcon extends Vue {
  @Prop({ required: false }) readonly vehicleAssignment?: VehicleAssignment
  @Prop({ required: false, default: 0 }) readonly moreRequiredCount?: number

  get image(): string | null {
    if (this.vehicleAssignment) {
      //TODO: figure out where to pull the vehicle image from
      return 'https://www.nationalbuscharter.com/employee/upload/cityBanner/1593699841national-atlanta-charter-bus.jpg'
    }
    return null
  }
}
</script>
