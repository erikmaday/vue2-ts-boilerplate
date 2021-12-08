<template>
  <TripAssignmentIcon
    :image-source="image"
    icon-name="person"
    :more-required-count="moreRequiredCount"
  />
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import TripAssignmentIcon from '@/components/TripAssignmentIcon.vue'
import { DriverAssignment } from '@/models/dto'

@Component({
  components: {
    TripAssignmentIcon,
  },
})
export default class DriverAssignmentIcon extends Vue {
  @Prop({ required: false }) readonly driverAssignment: DriverAssignment
  @Prop({ required: false, default: 0 }) readonly moreRequiredCount: number

  get image(): string {
    if (this.driverAssignment) {
      //TODO: figure out where to pull the vehicle image from
      return 'https://pbs.twimg.com/profile_images/1267507368830664705/ErirCXMq_400x400.jpg'
    }
    return null
  }
}
</script>
