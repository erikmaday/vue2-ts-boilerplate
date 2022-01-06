<template>
  <v-row v-show="notes" no-gutters>
    <v-col class="shrink margin-r-2">
      <CUIcon color="gray-mid-light">comment</CUIcon>
    </v-col>
    <v-col class="grow font-14">
      {{ notesDisplay }}
      <button
        v-if="notes.length && showExpandButton"
        id="bid-detail-notes-expand-button"
        class="text-primary font-medium"
        @click="isExpanded = !isExpanded"
      >
        {{ isExpanded ? 'Less' : 'More' }}
      </button>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Trip } from '@/models/dto'
import { truncate } from '@/utils/string'
import { Component, Prop, Vue } from 'vue-property-decorator'

const PREVIEW_CHARACTER_COUNT = 80

@Component
export default class BidDetailNotes extends Vue {
  @Prop({ required: true }) readonly trip!: Trip
  isExpanded = false

  get notes(): string {
    return this.trip.description || ''
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
