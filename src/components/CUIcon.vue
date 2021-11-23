<template>
  <span @click="$emit('click')">
    <svg
      class="cu-icon"
      xmlns="http://www.w3.org/2000/svg"
      :height="height"
      :width="width"
      :viewBox="iconViewBox"
      :class="classes"
      :style="style"
      role="presentation"
      :aria-labelledby="!decorative ? ariaLabelledBy : null"
      :aria-hidden="decorative"
      v-bind="$attrs"
    >
      <title :id="ariaLabelledBy || iconFileName" lang="en">
        {{ iconFileName }} icon
      </title>
      <g fill="currentColor">
        <component :is="icon"></component>
      </g>
    </svg>
  </span>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class CUIcon extends Vue {
  @Prop(String)
  readonly fileName: string | undefined

  @Prop([String, Number])
  readonly width: string | number = 24

  @Prop([String, Number])
  readonly height: string | number = 24

  @Prop(String)
  readonly viewBox: string = '0 0 32 32'

  @Prop(Boolean)
  readonly icomoon: boolean = false

  @Prop(Boolean)
  readonly decorative: boolean = false

  @Prop(String)
  readonly ariaLabel: string | undefined

  @Prop(String)
  readonly color: string | undefined

  get iconFileName(): string | undefined {
    let iconFileName: string | undefined = undefined
    if (this.$slots.default?.[0]?.text) {
      iconFileName = this.$slots.default[0].text
    } else if (this.fileName) {
      iconFileName = this.fileName
    }

    if (iconFileName && iconFileName?.length > 1) {
      iconFileName = iconFileName[0].toUpperCase() + iconFileName.slice(1)
    }

    return iconFileName
  }

  get icon() {
    return () => import(`../assets/icons/${this.iconFileName}.vue`)
  }

  get iconViewBox(): string {
    if (this.icomoon) {
      return '0 0 24 24'
    }
    return this.viewBox
  }

  get ariaLabelledBy(): string {
    if (this.ariaLabel) {
      return this.ariaLabel
    }

    return `${this.iconFileName} icon`
  }

  get style(): string {
    const hexRegex = new RegExp('#[0-9a-fA-F]{3,6}', 'g')
    if (this.color && hexRegex.test(this.color)) {
      return `--color: ${this.color}`
    }
    return '--color: currentColor'
  }

  get classes(): string {
    const hexRegex = new RegExp('#[0-9a-fA-F]{3,6}', 'g')

    if (this.color && !hexRegex.test(this.color)) {
      return `text-${this.color}`
    }

    return ''
  }
}
</script>

<style lang="scss" scoped>
svg {
  color: var(--color);
}
</style>
