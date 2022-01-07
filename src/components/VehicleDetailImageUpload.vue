<template>
  <div
    class="
      w-full
      d-flex
      h-80
      align-center
      justify-center
      border-radius-regular border-2 border-dashed
      position-relative
      cursor-pointer
    "
    :class="{
      'background-blue-10 border-primary': !errorMessage,
      'background-red-10 border-error': errorMessage,
    }"
    @dragover.prevent
    @drop.prevent="handleDrop"
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
      @change="handleBrowse"
    />
    <CUIcon
      :color="!errorMessage ? 'primary' : 'error'"
      width="48px"
      height="48px"
      class="margin-x-4"
    >
      upload_circle
    </CUIcon>
    <h4
      class="font-bold font-weight-400 margin-r-4"
      :class="`text-${message.color}`"
    >
      {{ message.text }}
    </h4>
  </div>
</template>

<script lang="ts">
import { ColoredMessage } from '@/models/ColoredMessage'
import vehicleDetail from '@/store/modules/vehicleDetail'
import { pluralize } from '@/utils/string'
import { Component, Vue } from 'vue-property-decorator'

const MAX_NUM_OF_PHOTOS = 6

@Component
export default class VehicleDetailImageUpload extends Vue {
  errorMessage: string | null = null

  get message(): ColoredMessage {
    let text = null
    let color = 'black'
    if (!this.errorMessage) {
      text = `Drop ${this.morePhotosAllowedCount ? 'up to ' : ''}${
        this.morePhotosAllowedCount
      } more vehicle ${pluralize(
        this.morePhotosAllowedCount,
        'image'
      )} here, or click to browse`
    } else {
      text = this.errorMessage
      color = 'error'
    }
    return { text, color }
  }

  get activePhotosCount(): number {
    return vehicleDetail.getVehiclePhotos.filter((photo) => photo.active).length
  }

  get morePhotosAllowedCount(): number {
    return MAX_NUM_OF_PHOTOS - this.activePhotosCount
  }

  handleBrowse(event: Event): void {
    this.addPhotos(event.target.files)
  }
  handleDrop(event: Event): void {
    this.addPhotos(event.dataTransfer.files)
  }

  addPhotos(files: FileList): void {
    this.errorMessage = null
    const filesArray = Array.from(files)
    if (filesArray.length > this.morePhotosAllowedCount) {
      this.errorMessage = `Only ${this.morePhotosAllowedCount} more ${pluralize(
        this.morePhotosAllowedCount,
        'file'
      )} ${
        this.morePhotosAllowedCount !== 1 ? 'are' : 'is'
      } allowed to upload. Please try again.`
      return
    }

    const images = Array.from(files).map((file) => {
      const newImage = {
        vehiclePhotoId: null,
        vehicleId: null,
        imagePath: URL.createObjectURL(file),
        primaryImage: false,
        active: true,
        file,
      }
      return newImage
    })
    vehicleDetail.addPhotos(images)
  }
}
</script>
