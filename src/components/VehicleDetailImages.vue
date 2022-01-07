<template>
  <v-row wrap>
    <v-col cols="12" class="padding-t-0">
      <h3>Vehicle Images</h3>
    </v-col>
    <v-col cols="12">
      <VehicleDetailImageUpload
        v-if="!vehicleDetail.getIsModeView && activePhotos.length < 6"
        class="margin-t-3"
        :class="{
          'margin-b-3': activePhotos.length,
        }"
      />
    </v-col>
    <v-col
      v-for="(photo, photoIndex) in activePhotos"
      :key="`vehicle-photo-${photoIndex}-${photo.imagePath}`"
      cols="12"
      :class="{ 'padding-t-0': photoIndex === 0 }"
    >
      <VehicleDetailImage v-if="photo" :photo="photo" />
    </v-col>
    <v-col
      v-if="!activePhotos.length && vehicleDetail.getIsModeView"
      cols="12"
      class="padding-t-0"
    >
      <VehicleDetailImage no-images-found />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import VehicleDetailImage from '@/components/VehicleDetailImage.vue'
import VehicleDetailImageUpload from '@/components/VehicleDetailImageUpload.vue'
import { VehiclePhotoDTO } from '@/models/dto'
import vehicleDetail from '@/store/modules/vehicleDetail'

@Component({ components: { VehicleDetailImageUpload, VehicleDetailImage } })
export default class VehicleDetailImages extends Vue {
  vehicleDetail = vehicleDetail

  get vehiclePhotos(): VehiclePhotoDTO[] {
    return vehicleDetail.getVehiclePhotos
  }

  get activePhotos(): VehiclePhotoDTO[] {
    return this.vehiclePhotos.filter((photo) => photo.active)
  }
}
</script>
