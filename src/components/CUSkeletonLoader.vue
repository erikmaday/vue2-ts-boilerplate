<template>
  <div :style="styles" :class="computedClasses" />
</template>
<script lang="ts">
import deepClone from '@/utils/deepClone'
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({})
export default class CUSkeletonLoader extends Vue {
  @Prop({ type: String, default: '', required: false }) readonly type: string
  @Prop({ type: String, default: '', required: false }) readonly width: string
  @Prop({ type: String, default: '', required: false }) readonly height: string
  @Prop({ type: String, default: '', required: false })
  readonly classes: string
  @Prop({ type: Boolean, default: false, required: false })
  readonly multiply: boolean

  get computedHeight(): string {
    if (this.height) {
      return this.height
    }
    if (this.type === 'button') {
      return '40px'
    }
    if (this.type === 'h1') {
      return '29px'
    }
    if (this.type === 'text') {
      return '18px'
    }
    if (this.type === 'detail-text') {
      return '16px'
    }
    if (this.type === 'icon') {
      return '24px'
    }
    return '14px'
  }

  get computedWidth(): string {
    if (this.width) {
      return this.width
    }
    if (this.type === 'icon') {
      return '24px'
    }
    if (this.type === 'avatar') {
      return this.computedHeight
    }
    return '100%'
  }

  get styles(): { [key: string]: string | number } {
    const styles = {
      height: this.computedHeight,
      width: this.computedWidth,
    }
    if (this.type === 'chip') {
      styles['border-radius'] = this.computedHeight
    }
    return styles
  }

  get computedClasses(): string {
    let classes = deepClone(this.classes)
    if (this.type === 'avatar') {
      classes = `${classes} border-radius-round`
    }
    if (this.multiply) {
      classes = `${classes} multiply`
    }
    return classes
  }
}
</script>

<style lang="scss" scoped>
div {
  background-color: $gray-border;
  position: relative;
  overflow: hidden;
  border-radius: $border-radius-root;

  &.multiply {
    mix-blend-mode: multiply;
  }

  &::after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform: translateX(-100%);
    background-image: linear-gradient(
      90deg,
      rgba(#fff, 0) 0,
      rgba(#fff, 0.2) 20%,
      rgba(#fff, 0.5) 60%,
      rgba(#fff, 0)
    );
    animation: shimmer 2s infinite;
    content: '';
  }

  @keyframes shimmer {
    100% {
      transform: translateX(100%);
    }
  }
}
</style>
