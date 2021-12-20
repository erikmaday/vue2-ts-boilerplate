<template>
  <div>
    <p class="font-14">Calculated Price: $XXXX.XX</p>
    <p class="font-14">Actual awarded price would be: $XXXX.XX</p>
    <v-btn color="primary" small class="w-full margin-t-4">
      Submit Bid for $XXXX.XX
    </v-btn>
    <v-btn
      color="primary"
      outlined
      small
      class="w-full margin-t-4"
      @click="$emit('start-custom-bid', true)"
    >
      Submit Other Price
    </v-btn>
    <v-divider class="margin-t-4" />

    <p class="font-14 text-primary margin-t-5 text-align-center cursor-pointer">
      Don't do any of that and mark as sold out
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class BidDetailActionsStandard extends Vue {
  // @Prop({ required: true }) readonly trip!: Trip
}
</script>
