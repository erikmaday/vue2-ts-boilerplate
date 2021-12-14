<template>
  <GmapMap
    ref="mapRef"
    :center="center"
    :zoom="7"
    :options="options"
    class="w-full h-240"
  />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mapStyles } from '@/data/mapStyles'
@Component
export default class BookingDetailMap extends Vue {
  map = null
  center = { lat: 10, lng: 10 }
  bounds = null
  options = {
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: true,
    disableDefaultUi: true,
    styles: mapStyles,
  }
}
</script>
