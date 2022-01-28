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
    switch (this.type) {
      case 'button':
        return '40px'
      case 'text-button':
        return '24px'
      case 'h1':
        return '29px'
      case 'h2':
        return '31px'
      case 'h3':
        return '27px'
      case 'text':
        return '18px'
      case 'detail-text':
        return '16px'
      case 'icon':
        return '24px'
      case 'checkbox':
        return '20px'
      case 'divider':
        return '1px'
      case 'mobile-table-cell':
        return '200px'
      case 'table-cell':
      case 'table-header':
        return '18px'
      case 'text-field':
        return '50px'
      default:
        return '14px'
    }
  }

  get computedWidth(): string {
    if (this.width) {
      return this.width
    }
    switch (this.type) {
      case 'icon':
        return '24px'
      case 'checkbox':
        return '20px'
      case 'avatar':
        return this.computedHeight
      case 'table-cell':
      case 'table-header':
        return '88px'
      default:
        return '100%'
    }
  }

  get styles(): { [key: string]: string | number } {
    const styles = {
      height: this.computedHeight,
      width: this.computedWidth,
    }
    if (this.type === 'chip') {
      styles['border-radius'] = this.computedHeight
    }
    if (this.type === 'checkbox') {
      styles['margin'] = '2px'
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
    if (this.type === 'text-button') {
      classes = `${classes} margin-y-2`
    }
    if (this.type === 'table-cell' || this.type === 'table-header') {
      classes = `${classes} border-radius-3`
    }
    classes = `${classes} cursor-wait`
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
