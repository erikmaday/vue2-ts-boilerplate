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
import auth from '@/store/modules/auth'
import { ColoredMessage } from '@/models/ColoredMessage'
import { Component, Prop, Vue } from 'vue-property-decorator'
import company from '@/services/company'

@Component
export default class ProfileIconUpload extends Vue {
  @Prop({ required: true }) readonly entityType!: string
  errorMessage: string | null = null

  get message(): ColoredMessage {
    let text = null
    let color = 'black'
    if (!this.errorMessage) {
      text = `Drop an image here, or click to browse`
    } else {
      text = this.errorMessage
      color = 'error'
    }
    return { text, color }
  }

  handleBrowse(event: Event): void {
    const target = event.target as HTMLInputElement
    this.addPhoto(target.files[0])
  }
  handleDrop(event: DragEvent): void {
    this.addPhoto(event.dataTransfer.files[0])
  }

  async addPhoto(file: File): Promise<void> {
    this.errorMessage = null

    const formData = new FormData()
    formData.append('file', file)
    if (this.entityType === 'company') {
      await company.uploadCompanyPhoto(auth.getUser.companyId, formData)
    }
    this.$emit('changePhoto')
  }
}
</script>
