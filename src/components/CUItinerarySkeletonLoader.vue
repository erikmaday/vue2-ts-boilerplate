<template>
  <CUItinerary>
    <CUItineraryItem
      v-for="stopIndex in count"
      loading
      :key="`stop-skeleton-loader-${stopIndex}`"
    >
      <div class="padding-l-4 padding-b-4">
        <CUSkeletonLoader type="text" width="200px" classes="margin-y-1" />
        <CUSkeletonLoader type="text" width="250px" classes="margin-y-1" />
        <CUSkeletonLoader
          v-if="stopIndex > 1 && stopIndex < count"
          type="text"
          width="250px"
        />
      </div>
    </CUItineraryItem>
  </CUItinerary>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import CUItinerary from '@/components/CUItinerary.vue'
import CUItineraryItem from '@/components/CUItineraryItem.vue'

@Component({ components: { CUItinerary, CUItineraryItem } })
export default class CUItinerarySkeletonLoader extends Vue {
  @Prop({ type: Number, required: false, default: 3 }) readonly count!: number
}
</script>
