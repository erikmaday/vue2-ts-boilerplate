<template>
  <div
    class="
      w-full
      h-80
      border-radius-regular border-2 border-solid border-gray-border
      d-flex
      align-center
    "
    :class="{ 'background-error': isConfirmingDelete }"
  >
    <div
      v-if="isConfirmingDelete"
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
    <template v-if="!isConfirmingDelete">
      <img
        class="
          h-full
          w-112
          margin-r-10
          border-radius-top-left-regular border-radius-bottom-left-regular
        "
        :src="photoSource"
      />
      <CUTextField
        class="d-flex grow margin-r-4"
        :disabled="isModeView"
        placeholder="Add a title"
        hide-details
      />
      <!-- <CUIcon
      v-if="!isModeView"
      color="success"
      :key="`successful-icon`"
      class="cursor-pointer margin-r-4"
    >
      check_circle
    </CUIcon> -->
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

  isConfirmingDelete = false

  get photoSource(): string {
    if (this.photo) {
      return `https://${baseUrl()}${this.photo.imagePath}`
    }
    return ''
  }
}
</script>
