<template>
  <v-col
    class="grow padding-r-10"
    :class="{
      'padding-b-4': $vuetify.breakpoint.smAndUp,
      'padding-b-6': $vuetify.breakpoint.xs,
    }"
  >
    <v-row>
      <v-col cols="12">
        <h3>Unsaved Bid Changes</h3>
      </v-col>
      <v-col cols="12">
        Click Submit All Bids to update your bid prices. Are you sure you want
        to leave this page and lose unsaved changes?
      </v-col>
    </v-row>
    <v-row>
      <v-spacer />
      <v-col cols="auto">
        <v-btn small text color="primary" @click="$emit('cancel')">
          Cancel
        </v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn small color="primary" @click="$emit('leave-page')">
          Leave Page
        </v-btn>
      </v-col>
    </v-row>
  </v-col>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class BidDetailUnsavedChanges extends Vue {}
</script>
