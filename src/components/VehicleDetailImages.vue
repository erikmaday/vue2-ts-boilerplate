<template>
  <v-row wrap>
    <v-col cols="12" class="padding-t-0">
      <h3>Vehicle Images</h3>
    </v-col>
    <v-col cols="12">
      <VehicleDetailImageUpload
        v-if="!isModeView && activePhotos.length < 6"
        :vehicle-photos="vehiclePhotoList"
        class="margin-t-3"
        :class="{
          'margin-b-3': activePhotos.length,
        }"
        @add-photos="$emit('add-photos', $event)"
      />
    </v-col>
    <v-col
      v-for="(photo, photoIndex) in activePhotos"
      :key="`vehicle-photo-${photoIndex}-${photo.imagePath}`"
      cols="12"
      :class="{ 'padding-t-0': photoIndex === 0 }"
    >
      <VehicleDetailImage
        v-if="photo"
        :photo="photo"
        :upload-percentage="uploadPercentage"
        :is-mode-edit="isModeEdit"
        :is-mode-view="isModeView"
        :is-mode-add="isModeAdd"
        @delete="removePhoto"
      />
    </v-col>
    <v-col
      v-if="!activePhotos.length && isModeView"
      cols="12"
      class="padding-t-0"
    >
      <VehicleDetailImage no-images-found />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Model, Prop, Vue, Watch } from 'vue-property-decorator'
import VehicleDetailImage from '@/components/VehicleDetailImage.vue'
import VehicleDetailImageUpload from '@/components/VehicleDetailImageUpload.vue'
import { VehiclePhotoDTO } from '@/models/dto'
import { removeItem } from '@/utils/array'

@Component({ components: { VehicleDetailImageUpload, VehicleDetailImage } })
export default class VehicleDetailImages extends Vue {
  @Model('change') readonly vehiclePhotos!: VehiclePhotoDTO[]
  @Prop({ required: true, type: Boolean }) readonly isModeView!: boolean
  @Prop({ required: true, type: Boolean }) readonly isModeAdd!: boolean
  @Prop({ required: true, type: Boolean }) readonly isModeEdit!: boolean
  @Prop({ required: true, type: Number }) readonly uploadPercentage!: number

  vehiclePhotoList: VehiclePhotoDTO[] | null = []

  @Watch('vehiclePhotoList', { deep: true })
  vehicleChanged(value: VehiclePhotoDTO[]): void {
    this.$emit('change', value)
  }

  @Watch('vehiclePhotos', { deep: true, immediate: true })
  parentPhotosChanged(value: VehiclePhotoDTO[]): void {
    this.vehiclePhotoList = value
  }

  get activePhotos(): VehiclePhotoDTO[] {
    return this.vehiclePhotos.filter((photo) => photo.active)
  }

  removePhoto(photo: VehiclePhotoDTO): void {
    photo.active = false
    if (photo.file) {
      this.vehiclePhotoList = removeItem(this.vehiclePhotoList, photo)
    }
  }
}
</script>
