<template>
  <div class="my-company__sidebar margin-t-10">
    <div class="my-company__sidebar-wrapper padding-y-5">
        <div
            v-for="(item, index) in links"
            :key="`company-sidebar-${index}`"
          :class="`
            my-company__sidebar-item
            flex-row
            align-center
            padding-y-3 padding-l-3
            margin-y-1
            cursor-pointer
            ${mode === item.name ? 'my-company__sidebar-item--active' : ''}
          `"
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
          {{ toTitle(item.name) }}
        </div>
    </div>
  </div>
</template>
<script lang="ts">
import { PropType } from 'vue'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { SidebarLink } from '@/models/SidebarLink'
import CUIcon from '@/components/CUIcon.vue'
import { toTitle } from '@/utils/string'

@Component({
  components: { CUIcon },
})
export default class CompanySidebar extends Vue {
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

  toTitle = toTitle

  handleNavigationClick(item: SidebarLink): void {
    this.$router.push({ name: item.name })
  }
}
</script>

<style lang="scss" scoped>
.my-company__sidebar {
  font-weight: bold;

  &-item {
    border-radius: 5px;
    &:hover {
    background: $gray-header-alt;
      transition: 0.05s ease-in-out all;
    }

    &--active {
      background: $gray-header-alt;
      color: $primary !important;
    }
  }
}
</style>
