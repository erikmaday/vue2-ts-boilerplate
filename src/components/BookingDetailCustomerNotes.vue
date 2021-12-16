<template>
  <v-row>
    <v-col cols="12">
      <p class="font-16 text-gray-light">Customer Notes</p>
      <p class="margin-t-0">
        {{ notesDisplay }}
        <button
          v-if="notes.length"
          id="customer-notes-expand-button"
          class="text-primary font-medium"
          @click="isExpanded = !isExpanded"
        >
          {{ isExpanded ? 'Less' : 'More' }}
        </button>
      </p>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { ReservationDetail } from '@/models/dto'
import { truncate } from '@/utils/string'
import { Component, Prop, Vue } from 'vue-property-decorator'

const PREVIEW_CHARACTER_COUNT = 140

@Component
export default class BookingDetailCustomerNotes extends Vue {
  @Prop({ required: true }) readonly reservation!: ReservationDetail

  isExpanded = false

  get notes(): string {
    return this.reservation?.customerNotes || ''
  }

  get showExpandButton(): boolean {
    return this.notes.length > PREVIEW_CHARACTER_COUNT
  }

  get notesDisplay(): string {
    if (this.isExpanded) {
      return this.notes
    }
    return truncate(this.notes, PREVIEW_CHARACTER_COUNT, true)
  }
}
</script>
