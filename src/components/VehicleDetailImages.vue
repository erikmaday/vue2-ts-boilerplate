<template>
  <v-row wrap>
    <v-col cols="12" class="padding-t-0">
      <CUSkeletonLoader
        v-if="showLoaders"
        type="h3"
        width="132px"
        style="margin-bottom: 1px"
      />
      <h3 v-else>Vehicle Images</h3>
    </v-col>
    <v-col cols="12">
      <CUSkeletonLoader
        v-if="showLoaders && !vehicleDetail.getIsModeView"
        class="margin-y-3"
        height="80px"
      />
      <VehicleDetailImageUpload
        v-if="
          !showLoaders &&
          !vehicleDetail.getIsModeView &&
          activePhotos.length < 6
        "
        class="margin-t-3"
        :class="{
          'margin-b-3': activePhotos.length,
        }"
      />
    </v-col>
    <template v-if="showLoaders">
      <v-col
        v-for="photo in 3"
        :key="`vehicle-photo-skeleton-loader-${photo}`"
        cols="12"
        :class="{ 'padding-t-0': photo === 1 }"
      >
        <div class="d-flex align-center">
          <CUSkeletonLoader height="80px" />
          <CUSkeletonLoader
            v-if="vehicleDetail.getIsModeEdit"
            type="icon"
            class="margin-x-4"
          />
        </div>
      </v-col>
    </template>
    <template v-else-if="activePhotos.length">
      <v-col
        v-for="(photo, photoIndex) in activePhotos"
        :key="`vehicle-photo-${photoIndex}-${photo.imagePath}`"
        cols="12"
        :class="{ 'padding-t-0': photoIndex === 0 }"
      >
        <VehicleDetailImage v-if="photo" :photo="photo" />
      </v-col>
    </template>
    <v-col
      v-if="!showLoaders && !activePhotos.length && vehicleDetail.getIsModeView"
      cols="12"
      class="padding-t-0"
    >
      <VehicleDetailImage :photo="undefined" no-images-found />
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

  get showLoaders(): boolean {
    return vehicleDetail.getShowLoaders
  }

  get vehiclePhotos(): VehiclePhotoDTO[] {
    return vehicleDetail.getVehiclePhotos
  }

  get activePhotos(): VehiclePhotoDTO[] {
    return this.vehiclePhotos.filter((photo) => photo.active)
  }
}
</script>
