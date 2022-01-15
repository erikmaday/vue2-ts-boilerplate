<template>
  <div
    :class="{
      'w-full margin-t-3': $vuetify.breakpoint.xs,
    }"
  >
    <DriverAssignmentIcons
      v-if="!needsAcceptance"
      :reservation="row"
    />
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import DriverAssignmentIcons from '@/components/DriverAssignmentIcons.vue'
import { Reservation } from '@/models/dto'
import { ReferralStatus } from '@/utils/enum'

@Component({ components: { DriverAssignmentIcons } })
export default class BookingsListDriverAssignments extends Vue {
  @Prop({ required: false }) readonly row: Reservation

  get needsAcceptance(): boolean {
    return this.row.referralStatus !== ReferralStatus.Accepted
  }

  get needsAssignment(): boolean {
    return (
      !this.needsAcceptance &&
      (this.row.assignedDriverPercentage < 100 ||
        this.row.assignedVehiclePercentage < 100)
    )
  }
}
</script>
