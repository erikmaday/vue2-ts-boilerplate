<template>
  <p v-if="needsAcceptance" class="font-medium text-red margin-t-0">
    Needs Acceptance
  </p>
  <p v-else-if="needsAssignment" class="font-medium text-red margin-t-0">
    Needs Assignment
  </p>
  <VehicleAssignmentIcons v-else :reservation="row" />
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import VehicleAssignmentIcons from '@/components/VehicleAssignmentIcons.vue'
import { Reservation } from '@/models/dto'
import { ReferralStatus } from '@/utils/enum'

@Component({ components: { VehicleAssignmentIcons } })
export default class BookingsListVehicleAssignments extends Vue {
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
