<template>
  <v-row>
    <v-col cols="12">
      <CUSkeletonLoader v-if="loading" type="h3" width="250px" />
      <h3 v-else class="font-18">Have questions about the trip?</h3>
      <CUSkeletonLoader
        v-if="loading"
        type="test"
        width="350px"
        class="margin-t-2"
      />
      <p v-else>
        Click support which can be raising a ticket or phone number or email
      </p>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class BookingDetailSupport extends Vue {
  @Prop({ required: true, type: Boolean, default: false })
  readonly loading!: boolean
}
</script>
