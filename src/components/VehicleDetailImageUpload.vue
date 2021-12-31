<template>
  <div
    class="
      w-full
      d-flex
      h-80
      align-center
      justify-center
      background-blue-10
      border-radius-regular border-2 border-dashed border-primary
      position-relative
      cursor-pointer
    "
    @dragover.prevent
    @drop.prevent="dragFile"
  >
    <input
      type="file"
      accept="image/*"
      multiple
      class="
        opacity-0
        w-full
        h-full
        position-absolute
        top-0
        left-0
        cursor-pointer
      "
      @change="uploadFile"
    />
    <CUIcon color="primary" width="48px" height="48px" class="margin-x-4">
      upload_circle
    </CUIcon>
    <h4 class="font-bold font-weight-400 margin-r-4">
      {{ actionText }}
    </h4>
    <ul v-for="(file, fileIndex) in files" :key="fileIndex">
      <li>{{ file.name }}</li>
    </ul>
  </div>
</template>

<script lang="ts">
import { VehiclePhotoDTO } from '@/models/dto'
import { pluralize } from '@/utils/string'
import { Component, Model, Vue, Watch } from 'vue-property-decorator'

const MAX_NUM_OF_PHOTOS = 6

@Component
export default class VehicleDetailImageUpload extends Vue {
  @Model('change') readonly vehiclePhotos!: VehiclePhotoDTO[]

  vehiclePhotoList: VehiclePhotoDTO[] | null = []

  @Watch('vehiclePhotoList', { deep: true })
  vehicleChanged(value: VehiclePhotoDTO[]): void {
    this.$emit('change', value)
  }

  @Watch('vehiclePhotos', { deep: true, immediate: true })
  parentPhotosChanged(value: VehiclePhotoDTO[]): void {
    this.vehiclePhotoList = value
  }

  files: any[] = []

  get actionText(): string {
    return `Drop ${this.morePhotosAllowedCount ? 'up to ' : ''}${
      this.morePhotosAllowedCount
    } more vehicle ${pluralize(
      this.morePhotosAllowedCount,
      'image'
    )} here, or click to browse`
  }

  get morePhotosAllowedCount(): number {
    return MAX_NUM_OF_PHOTOS - this.vehiclePhotoList.length
  }

  uploadFile(e) {
    console.log(e.target.files)
    this.files = e.target.files
  }
  dragFile(e) {
    console.log(e.dataTransfer.files)
    this.files = e.dataTransfer.files
  }
}
</script>
