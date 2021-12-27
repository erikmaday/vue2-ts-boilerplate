<template>
  <div class="position-relative max-w-200 white-space-nowrap">
    <div
      class="
        w-200
        h-200
        object-fit-cover
        border-radius-round
        overflow-hidden
        border-solid border-4 border-gray-border
      "
    >
      <img v-if="photoSrc !== ''" class="h-full w-full" :src="photoSrc" />
      <template v-else>
        <div
          class="
            d-flex
            align-center
            justify-center
            h-192
            w-192
            background-gray-header
          "
        >
          <CUIcon color="gray-mid-light" width="120px" height="120px">
            person
          </CUIcon>
        </div>
      </template>
    </div>
    <div v-show="mode !== 'view'" class="position-absolute right-0 bottom-2">
      <button
        class="
          w-52
          h-52
          background-primary
          outline-none
          d-flex
          align-center
          justify-center
          border-radius-round
          cursor-pointer
        "
        @click="(e) => e.preventDefault()"
      >
        <CUIcon color="white" width="24px" height="24px">upload</CUIcon>
      </button>
      <input
        class="w-52 h-52 position-absolute top-0 opacity-0 z-100 cursor-pointer"
        type="file"
        accept="image/*"
        @change="(e) => $emit('upload', e)"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class CompanyUsersDetailUserPhoto extends Vue {
  @Prop({
    type: String,
    default: '',
  })
  photoSrc = ''

  @Prop({
    type: String,
    required: true
  })
  mode!: string
}
</script>