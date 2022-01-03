<template>
  <div
    class="
      w-full
      h-80
      border-radius-regular border-2 border-solid border-gray-border
      d-flex
      align-center
    "
    :class="{
      'background-error': isConfirmingDelete,
      'background-gray-header': noImagesFound,
    }"
  >
    <div
      v-if="noImagesFound"
      class="w-full h-full d-flex align-center justify-center"
    >
      <p class="margin-t-0 text-black font-medium">
        No images found. Click edit to upload vehicle images.
      </p>
    </div>
    <div
      v-else-if="isConfirmingDelete"
      class="w-full h-full d-flex align-center padding-l-8 padding-r-5"
    >
      <p class="margin-t-0 text-white font-medium">
        Are you sure you want to delete this photo?
      </p>
      <v-spacer />
      <v-btn
        color="white"
        class="margin-r-2"
        small
        text
        @click="isConfirmingDelete = false"
      >
        Cancel
      </v-btn>
      <v-btn
        color="white"
        class="text-error"
        small
        @click="$emit('delete', photo)"
      >
        Delete
      </v-btn>
    </div>
    <template v-else-if="!isConfirmingDelete">
      <img
        class="
          h-full
          w-112
          border-radius-top-left-regular border-radius-bottom-left-regular
          object-fit-cover
        "
        :class="{ 'opacity-50': isUploading }"
        :src="photoSource"
      />
      <div
        v-if="isUploading"
        class="
          d-flex
          h-full
          background-blue-10
          transition-all transition-duration-50
        "
        :style="{
          width: `calc(${uploadPercentage}% - 112px)`,
        }"
      ></div>
      <template v-else>
        <CUTextField
          class="d-flex grow margin-r-4 margin-l-10"
          :disabled="isModeView"
          placeholder="Add a title"
          hide-details
        />
        <CUIcon
          v-if="isModeEdit"
          :key="`delete-icon`"
          class="
            cursor-pointer
            margin-r-4
            text-gray-mid-light
            hover:text-error
            transition-all transition-duration-100
          "
          @click="isConfirmingDelete = true"
        >
          trash
        </CUIcon>
      </template>
    </template>
  </div>
</template>

<script lang="ts">
import { VehiclePhotoDTO } from '@/models/dto'
import { baseUrl } from '@/utils/env'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class VehicleDetailImage extends Vue {
  @Prop({ required: true }) readonly photo!: VehiclePhotoDTO
  @Prop({ required: true, type: Boolean }) readonly isModeView!: boolean
  @Prop({ required: true, type: Boolean }) readonly isModeAdd!: boolean
  @Prop({ required: true, type: Boolean }) readonly isModeEdit!: boolean
  @Prop({ required: false, type: Boolean }) readonly noImagesFound!: boolean
  @Prop({ required: true, type: Number }) readonly uploadPercentage!: number

  isConfirmingDelete = false

  get isUploading(): boolean {
    return this.uploadPercentage && this.photo.file
  }

  get photoSource(): string {
    if (this.photo) {
      if (this.photo.vehiclePhotoId) {
        return `https://${baseUrl()}${this.photo.imagePath}`
      }
      return this.photo.imagePath
    }
    return ''
  }
}
</script>
