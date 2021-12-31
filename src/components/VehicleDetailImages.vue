<template>
  <v-row wrap>
    <v-col cols="12" class="padding-t-0">
      <h3>Vehicle Images</h3>
    </v-col>
    <v-col cols="12">
      <VehicleDetailImageUpload
        v-if="!isModeView"
        v-model="vehiclePhotoList"
        class="margin-t-3 margin-b-3"
      />
    </v-col>
    <v-col
      v-for="(photo, photoIndex) in vehiclePhotos"
      :key="`vehicle-photo-${photoIndex}-${photo.vehiclePhotoId}`"
      cols="12"
      :class="{ 'padding-t-0': photoIndex === 0 }"
    >
      <VehicleDetailImage
        :photo="photo"
        :is-mode-edit="isModeEdit"
        :is-mode-view="isModeView"
        :is-mode-add="isModeAdd"
        @delete="removePhoto"
      />
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

  vehiclePhotoList: VehiclePhotoDTO[] | null = []

  @Watch('vehiclePhotoList', { deep: true })
  vehicleChanged(value: VehiclePhotoDTO[]): void {
    this.$emit('change', value)
  }

  @Watch('vehiclePhotos', { deep: true, immediate: true })
  parentPhotosChanged(value: VehiclePhotoDTO[]): void {
    this.vehiclePhotoList = value
  }

  removePhoto(photo: VehiclePhotoDTO): void {
    this.vehiclePhotoList = removeItem(this.vehiclePhotoList, photo)
    this.$emit('remove', photo.vehiclePhotoId)
  }
}
</script>
