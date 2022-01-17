<template>
  <div class="d-flex align-center">
    <div
      class="w-full h-80 border-radius-regular border-2 border-solid border-gray-border d-flex align-center"
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
          @click="vehicleDetail.removePhoto(photo)"
        >
          Delete
        </v-btn>
      </div>
      <template v-else-if="!isConfirmingDelete">
        <img
          class="h-full w-112 min-w-112 border-radius-top-left-3 border-radius-bottom-left-3 object-fit-cover"
          :class="{ 'opacity-50': isUploading }"
          :src="photoSource"
        />
        <div
          v-if="isUploading"
          class="d-flex h-full background-blue-10 transition-all transition-duration-50"
          :style="{
            width: `calc(${vehicleDetail.getUploadPercentage}% - 112px)`,
          }"
        ></div>
        <template v-else>
          <CUTextField
            @input="vehicleDetail.setPhotoLabel({ photo, label: $event })"
            :value="photo.label"
            class="photo-label-field d-flex grow margin-r-4 margin-l-10"
            :disabled="vehicleDetail.getIsModeView"
            placeholder="Add a title"
            hide-details
          />
          <template v-if="vehicleDetail.getIsModeView">
            <span
              style="padding: 2px 0"
              class="background-black text-white padding-x-5 font-12 border-radius-2 font-weight-bold margin-r-4"
              v-if="photo.primaryImage"
            >
              Default
            </span>
            <div v-else class="w-80 h-24 margin-r-4"></div>
          </template>
          <template v-if="vehicleDetail.getIsModeEdit">
            <div
              v-if="$vuetify.breakpoint.smAndUp"
              class="d-flex min-w-150 w-150 margin-r-4"
              @click="vehicleDetail.setPhotoAsPrimaryImage(photo)"
            >
              <v-simple-checkbox
                color="primary"
                :value="photo.primaryImage"
                :ripple="false"
                @input="vehicleDetail.setPhotoAsPrimaryImage(photo)"
              />
              <span class="text-12">Make Default</span>
            </div>
            <CUIcon
              v-else
              width="24px"
              height="24px"
              :class="{
                'text-yellow': photo.primaryImage,
              }"
              class="cursor-pointer margin-r-4 text-gray-mid-light hover:text-yellow transition-all transition-duration-100"
              key="default-icon"
              @click="vehicleDetail.setPhotoAsPrimaryImage(photo)"
            >
              star
            </CUIcon>
          </template>
        </template>
      </template>
    </div>
    <CUIcon
      v-if="vehicleDetail.getIsModeEdit"
      v-show="!isConfirmingDelete"
      :key="`delete-icon`"
      class="cursor-pointer margin-x-4 text-gray-mid-light hover:text-error transition-all transition-duration-100"
      @click="isConfirmingDelete = true"
    >
      trash
    </CUIcon>
    <div v-show="isConfirmingDelete" class="w-24 h-24 margin-x-4"></div>
  </div>
</template>

<script lang="ts">
import { VehiclePhotoDTO } from '@/models/dto'
import vehicleDetail from '@/store/modules/vehicleDetail'
import { baseUrl } from '@/utils/env'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class VehicleDetailImage extends Vue {
  @Prop({ required: true }) readonly photo!: VehiclePhotoDTO
  @Prop({ required: false, type: Boolean }) readonly noImagesFound!: boolean

  isConfirmingDelete = false
  vehicleDetail = vehicleDetail

  get isUploading(): boolean {
    return vehicleDetail.getUploadPercentage && !!this.photo.file
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
<style lang="scss" scoped>
@media only screen and (max-width: 989px) and (min-width: 960px) {
  .photo-label-field {
    flex-basis: 180px;
  }
}
</style>