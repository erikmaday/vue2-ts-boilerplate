<template>
  <div class="font-bold">
    <div
      v-for="(item, index) in links.filter((l) => !l.hide)"
      :key="`sidebar-link-${index}`"
      class="hover:background-black-5 d-flex border-radius-regular align-center padding-a-3 transition-duration-50 transition-ease-in transition-all margin-y-1 cursor-pointer"
      :class="{
        'background-black-5 text-primary': mode === item.name,
      }"
      @click="handleNavigationClick(item)"
    >
      <CUIcon
        width="20px"
        height="20px"
        class="margin-r-3"
        :color="mode === item.name ? 'primary' : 'gray'"
      >
        {{ item.icon }}
      </CUIcon>
      {{ item.label }}
    </div>
  </div>
</template>
<script lang="ts">
import { PropType } from 'vue'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { SidebarLink } from '@/models/SidebarLink'

@Component
export default class MainWithSidebarNavigation extends Vue {
  @Prop({
    type: Array as PropType<SidebarLink[]>,
    default: () => [],
  })
  private readonly links!: SidebarLink[]

  @Prop({
    type: String,
    default: '',
  })
  private readonly mode!: string

  handleNavigationClick(item: SidebarLink): void {
    this.$router.push({ name: item.name })
  }
}
</script>
