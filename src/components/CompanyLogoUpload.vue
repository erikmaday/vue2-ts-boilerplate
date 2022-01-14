<template>
  <div>
    <label v-if="label" class="font-14 text-left">{{ label }}</label>
    <div class="text-center position-relative">
      <div
        class="w-full d-flex h-200 align-center justify-center border-radius-regular position-relative text-center"
        :class="{
          'background-blue-10 border-primary':
            !src && !errorMessage && !disabled,
          'background-red-10 border-error': !src && errorMessage,
          'background-gray-lighter border-gray-border cursor-default':
            !src && disabled,
          'cursor-pointer': !disabled,
          'border-2 border-dashed': !src,
        }"
        @dragover.prevent
        @drop.prevent="handleDrop"
      >
        <template v-if="src">
          <img
            class="w-full h-full object-fit-contain border-radius-regular"
            :src="src"
          />
        </template>
        <template v-show="!src">
          <input
            type="file"
            accept="image/*"
            class="opacity-0 w-full h-full position-absolute top-0 left-0 cursor-pointer"
            @change="handleBrowse"
          />
          <v-row v-if="!src">
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
        </template>
      </div>
      <div
        v-if="src && !disabled"
        class="w-56 h-56 border-radius-round background-primary position-relative position-absolute cursor-pointer"
        style="left: 50%; transform: translateX(-50%); bottom: -23px"
      >
        <CUIcon color="white" width="24px" height="24px" class="margin-t-4">
          edit
        </CUIcon>
        <input
          type="file"
          accept="image/*"
          class="opacity-0 border-radius-round w-full h-full position-absolute top-0 left-0 cursor-pointer"
          :disabled="disabled"
          @change="handleBrowse"
        />
      </div>
    </div>
    <p v-if="caption" class="font-14 text-gray-light margin-t-6">
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
    if (!this.disabled) {
      this.addPhotos(event.dataTransfer.files)
    }
  }

  addPhotos(files: FileList): void {
    const filesArray = Array.from(files)
    if (filesArray.length > 1) {
      this.errorMessage = 'Please select only one file.'
      return
    }
    const file = files[0]
    this.$emit('input', file)
  }

  openFileBrowser(): void {
    console.log(this.$refs.imageInput)
  }
}
</script>
