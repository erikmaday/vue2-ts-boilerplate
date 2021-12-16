<template>
  <v-row>
    <v-col cols="12">
      <v-row class="align-center">
        <v-col class="shrink">
          <h3 class="font-18 white-space-nowrap">Comments</h3>
        </v-col>
        <v-spacer />
        <v-col class="shrink">
          <v-btn
            text
            small
            color="primary"
            class="padding-x-0"
            @click="isDialogOpen = true"
          >
            Add Comment
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col
          v-for="(comment, commentIndex) in comments"
          :key="`comment-${commentIndex}-${comment.reservationCommentId}`"
          cols="12"
          md="6"
          lg="4"
          class="margin-b-2"
        >
          <v-row>
            <v-col cols="12" class="padding-y-0">
              <p class="white-space-nowrap">
                <span class="font-medium">{{ comment.userName }}</span>
                - {{ formatTimestamp(comment.createdOn) }}
              </p>
            </v-col>
            <v-col
              cols="12"
              class="padding-y-0"
              :key="`comment-note-${commentIndex}-${comment.reservationCommentId}`"
            >
              <p>{{ comment.comment }}</p>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-col>
    <v-dialog
      v-model="isDialogOpen"
      :fullscreen="$vuetify.breakpoint.xs"
      width="500px"
      max-width="500px"
    >
      <v-card>
        <v-card-title class="background-primary text-white font-medium">
          Add Comment
        </v-card-title>
        <v-card-text>
          <v-textarea v-model="newComment" auto-grow outlined></v-textarea>
        </v-card-text>
        <v-card-actions class="d-flex justify-center">
          <v-btn color="primary" small text @click="cancelAddComment">
            Cancel
          </v-btn>
          <v-btn color="primary" small @click="submitComment">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script lang="ts">
import { ReservationDetail, ReservationComment } from '@/models/dto'
import { Component, Prop, Vue } from 'vue-property-decorator'
import reservation from '@/services/reservation'

@Component
export default class BookingDetailCustomerInformation extends Vue {
  @Prop({ required: true }) readonly reservation!: ReservationDetail

  isDialogOpen = false
  newComment = ''
  savingComment = false

  get comments(): ReservationComment[] {
    return this.reservation?.reservationComments || []
  }

  formatTimestamp(timestamp: string): string {
    const datetime = this.$dayjs(timestamp)
    return `${datetime.format('MM/DD/YYYY')} • ${datetime.format('h:mm a')}`
  }

  cancelAddComment(): void {
    this.newComment = ''
    this.isDialogOpen = false
  }

  async submitComment(): Promise<void> {
    this.savingComment = true
    const payload = {
      note: this.newComment,
      reservation: { id: this.reservation.reservationId },
    }
    try {
      const commentResponse = await reservation.addComment(payload)
      if (commentResponse) {
        this.newComment = ''
        this.isDialogOpen = false
        this.$emit('refresh')
      }
    } catch (error) {
      // TODO: handle error
    }
    this.savingComment = false
  }
}
</script>
