<template>
  <CUIcon
    class="cursor-pointer transition-all transition-duration-100"
    :color="iconColor"
    :class="{ 'transform-115': active }"
    @click="$emit('click')"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
  >
    dot
  </CUIcon>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class PaginationDot extends Vue {
  @Prop() readonly active!: boolean
  @Prop({ default: 'primary' }) readonly activeColor!: string
  @Prop({ default: 'gray-mid-light' }) readonly hoverColor!: string
  @Prop({ default: 'gray-border' }) readonly inactiveColor!: string

  hover = false

  get iconColor(): string {
    if (this.active) {
      return this.activeColor
    }
    if (this.hover) {
      return this.hoverColor
    }
    return this.inactiveColor
  }
}
</script>
