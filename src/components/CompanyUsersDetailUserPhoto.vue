<template>
  <div class="user-photo">
    <div class="user-photo__src">
      <img v-if="photoSrc !== ''" class="h-full w-full" :src="photoSrc" />
      <template v-else>
        <div
          class="
            d-flex
            align-center
            justify-center
            h-190
            w-190
            background-gray-header
          "
        >
          <CUIcon color="gray-mid-light" width="120px" height="120px">
            person
          </CUIcon>
        </div>
      </template>
    </div>
    <div v-show="mode !== 'view'" class="user-photo__upload-group">
      <button class="user-photo__upload-btn" @click="(e) => $emit('upload', e)">
        <CUIcon color="white" width="24px" height="24px">upload</CUIcon>
      </button>
      <input type="file" accept="image/*" @change="(e) => $emit('upload', e)" />
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

<style lang="scss" scoped>
.user-photo {
  position: relative;
  max-width: 200px;

  &__src {
    width: 200px;
    height: 200px;
    object-fit: cover;
    border-radius: 50%;
    overflow: hidden;
    border: 5px solid $gray-border;
  }

  &__upload-btn {
    width: 50px;
    height: 50px;
    background: #00a6f2;
    outline: none;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  &__upload-group {
    position: absolute;
    right: 11px;
    bottom: 2px;

    input {
      width: 50px;
      height: 50px;
      position: absolute;
      top: 0;
      opacity: 0;
      z-index: 100;
      cursor: pointer;
    }
  }
}
</style>