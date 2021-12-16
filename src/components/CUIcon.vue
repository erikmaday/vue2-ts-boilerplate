<template>
  <svg
    class="cu-icon"
    xmlns="http://www.w3.org/2000/svg"
    :height="height"
    :width="width"
    :viewBox="viewBox"
    :class="classes"
    :style="style"
    role="presentation"
    :aria-labelledby="!decorative ? ariaLabelledBy : null"
    :aria-hidden="decorative"
    v-bind="$attrs"
    v-on="listeners"
  >
    <title :id="ariaLabelledBy || iconTitle" lang="en">
      {{ ariaLabelledBy }} icon
    </title>
    <g fill="currentColor">
      <component :is="icon"></component>
    </g>
  </svg>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { toPascal, toTitle } from '@/utils/string'

@Component
export default class CUIcon extends Vue {
  @Prop(String)
  readonly fileName: string | undefined

  @Prop({ default: 24 })
  readonly width: string | number | undefined

  @Prop({ default: 24 })
  readonly height: string | number | undefined

  @Prop({ default: '0 0 24 24' })
  readonly viewBox: string | undefined

  @Prop({ default: false, required: false })
  readonly decorative!: boolean

  @Prop(String)
  readonly ariaLabel: string | undefined

  @Prop(String)
  readonly color: string | undefined

  get listeners(): Record<string, unknown> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const vm = this
    return Object.assign({}, this.$listeners, {
      click: function (event: PointerEvent) {
        vm.$emit('click', event)
      },
    })
  }

  get isClickable(): boolean {
    return !!(this.$listeners && this.$listeners.click)
  }

  get iconFileName(): string | undefined {
    let iconFileName: string | undefined = undefined
    if (this.$slots.default?.[0]?.text) {
      iconFileName = this.$slots.default[0].text
    } else if (this.fileName) {
      iconFileName = this.fileName
    }

    if (iconFileName && iconFileName?.length > 1) {
      iconFileName = toPascal(iconFileName)
    }

    return iconFileName
  }

  get iconTitle(): string | undefined {
    let iconTitle: string | undefined = undefined
    if (this.iconFileName) {
      iconTitle = toTitle(this.iconFileName)
    }
    return iconTitle
  }

  get icon() {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    return () => import(`@/assets/icons/${this.iconFileName}.vue`)
  }

  get ariaLabelledBy(): string {
    if (this.ariaLabel) {
      return this.ariaLabel
    }

    return `${this.iconTitle} icon`
  }

  get style(): Record<string, unknown> {
    let color = 'currentColor'
    const hexRegex = new RegExp('#[0-9a-fA-F]{3,6}', 'g')
    if (this.color && hexRegex.test(this.color)) {
      color = this.color
    }
    return {
      '--color': color,
    }
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
