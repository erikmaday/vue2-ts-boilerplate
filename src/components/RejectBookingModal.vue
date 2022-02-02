<template>
  <CUModal v-model="isDialogOpen">
    <template #title>Reject Booking</template>
    <template #text>
      <v-form ref="rejection-form">
        <CUSelect
          v-model="referralRejectionReasonTypeId"
          :items="referralRejectionReasonTypes"
          :rules="[(val) => !!val || 'Reason is Required']"
          label="Reason for Rejecting"
          item-text="label"
          item-value="id"
          placeholder="Please select a reason for rejecting this booking"
        />
        <CUTextArea
          v-model="rejectNote"
          placeholder="Add reasons for rejection here."
          validate-on-blur
        />
      </v-form>
    </template>
    <template #actions>
      <v-spacer />
      <v-btn color="primary" small text @click="cancelRejectNote">Cancel</v-btn>
      <v-btn color="red" class="white--text" small @click="reject">
        Reject
      </v-btn>
    </template>
  </CUModal>
</template>

<script lang="ts">
import { ReferralRejectionRequest } from '@/models/dto'
import { Component, Prop, Vue, Watch, Model } from 'vue-property-decorator'
import reservation from '@/services/reservation'
import { Type } from '@/models/dto/Type'
import type from '@/services/type'
import { AxiosResponse } from 'axios'
import { EventBus } from '@/utils/eventBus'

@Component
export default class RejectBookingModal extends Vue {
  @Model('input') readonly value!: boolean | null
  @Prop({ required: true }) readonly reservationId!: number

  @Watch('isDialogOpen')
  isDialogOpenChanged(value: boolean): void {
    this.$emit('input', value)
  }
  @Watch('value', { immediate: true })
  valueChanged(value: boolean): void {
    this.isDialogOpen = value
  }

  isDialogOpen = false

  rejectNote = null

  referralRejectionReasonTypes: Type[] = []
  referralRejectionReasonTypeId: number = null

  mounted(): void {
    this.getReferralRejectionReasonTypes()
  }

  cancelRejectNote(): void {
    this.referralRejectionReasonTypeId = null
    this.rejectNote = null
    const form: any = this.$refs['rejection-form']
    form.reset()
    this.isDialogOpen = false
  }

  async getReferralRejectionReasonTypes(): Promise<void> {
    let response: AxiosResponse
    try {
      response = await type.referralRejectionReason()
      const { data } = response
      this.referralRejectionReasonTypes = data
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
      return
    }
  }

  async reject(): Promise<void> {
    if (this.reservationId === -1) {
      return
    }
    const form: any = this.$refs['rejection-form']
    if (!form.validate()) return
    const referralRejectionBody: ReferralRejectionRequest = {
      notes: this.rejectNote,
      referralRejectionReasonTypeId: this.referralRejectionReasonTypeId,
    }
    await reservation.reject(this.reservationId, referralRejectionBody)
    this.isDialogOpen = false
    this.$router.push({ name: 'bookings' })
    this.$emit('reject-successful')
  }
}
</script>
