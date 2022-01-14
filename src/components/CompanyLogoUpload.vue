<template>
  <div>
    <label v-if="label" class="font-14">{{ label }}</label>
    <img
      v-if="src"
      class="w-full h-200 object-fit-contain border-radius-regular"
      :src="src"
    />
    <div
      v-else
      class="w-full d-flex h-200 align-center justify-center border-radius-regular border-2 border-dashed position-relative"
      :class="{
        'background-blue-10 border-primary': !errorMessage && !disabled,
        'background-red-10 border-error': errorMessage,
        'background-gray-lighter border-gray-border cursor-default': disabled,
        'cursor-pointer': !disabled,
      }"
      @dragover.prevent
      @drop.prevent="handleDrop"
    >
      <input
        type="file"
        accept="image/*"
        class="opacity-0 w-full h-full position-absolute top-0 left-0 cursor-pointer"
        :cursor="{
          'cursor-default': disabled,
          'cursor-pointer': !disabled,
        }"
        :disabled="disabled"
        @change="handleBrowse"
      />
      <v-row>
        <v-col cols="12" class="text-center margin-b-0 padding-b-0">
          <CUIcon
            :color="iconColor"
            width="48px"
            height="48px"
            class="margin-x-auto"
          >
            upload_circle
          </CUIcon>
        </v-col>
        <v-col cols="12" class="text-center margin-t-0 padding-t-0">
          <h4
            class="font-bold font-weight-400"
            :class="`text-${message.color}`"
          >
            {{ message.text }}
          </h4>
        </v-col>
      </v-row>
    </div>
    <p v-if="caption" class="font-14 text-gray-light margin-t-1">
      {{ caption }}
    </p>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { ColoredMessage } from '@/models/ColoredMessage'

@Component({})
export default class CompanyLogoUpload extends Vue {
  @Prop({ required: false, type: String }) readonly label: string
  @Prop({ required: false, type: String }) readonly caption: string
  @Prop({ required: false, type: String }) readonly src: string
  @Prop({ required: true, type: Boolean }) readonly disabled!: boolean

  errorMessage: string | null = null

  get message(): ColoredMessage {
    let text = null
    let color = 'black'
    if (!this.errorMessage) {
      text = 'Drop your logo image here or browse'
    } else {
      text = this.errorMessage
      color = 'error'
    }
    return { text, color }
  }

  get activePhotosCount(): number {
    return 0
  }

  get morePhotosAllowedCount(): number {
    return 1
  }

  get iconColor(): string {
    if (this.disabled) {
      return 'gray-mid-light'
    }
    if (this.errorMessage) {
      return 'error'
    }
    return 'primary'
  }

  handleBrowse(event: Event): void {
    this.addPhotos((event.target as HTMLInputElement).files)
  }
  handleDrop(event: DragEvent): void {
    this.addPhotos(event.dataTransfer.files)
  }

  addPhotos(files: FileList, type: string): void {
    const filesArray = Array.from(files)
    if (filesArray.length > 1) {
      this.errorMessage = 'Please select only one file.'
      return
    }
    const file = files[0]
    this.$emit('input', file)

    // const image = URL.createObjectURL(file)
    // console.log(image)
    // const formData = new FormData()
    // formData.append('file', file)

    //       this[`${type}File`] = formData
    // this[`disabled${type}`] = false
  }

  // addPhotos(files: FileList): void {
  //   this.errorMessage = null
  //   const filesArray = Array.from(files)
  //   if (filesArray.length > this.morePhotosAllowedCount) {
  //     this.errorMessage = `Only ${this.morePhotosAllowedCount} more ${pluralize(
  //       this.morePhotosAllowedCount,
  //       'file'
  //     )} ${
  //       this.morePhotosAllowedCount !== 1 ? 'are' : 'is'
  //     } allowed to upload. Please try again.`
  //     return
  //   }

  //   const images = Array.from(files).map((file) => {
  //     const newImage = {
  //       vehiclePhotoId: null,
  //       vehicleId: null,
  //       imagePath: URL.createObjectURL(file),
  //       primaryImage: false,
  //       active: true,
  //       label: '',
  //       file,
  //     }
  //     return newImage
  //   })
  //   vehicleDetail.addPhotos(images)
  // }
}
</script>
