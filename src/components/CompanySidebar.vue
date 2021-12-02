<template>
  <div class="my-company__sidebar margin-t-10">
    <div class="my-company__sidebar-wrapper padding-y-5">
      <router-link
        v-for="(item, index) in links"
        :key="`company-sidebar-${index}`"
        :to="item.href"
      >
        <div
          class="
            my-company__sidebar-item
            flex-row
            align-center
            padding-y-4 padding-l-3
            cursor-pointer
          "
        >
          <CUIcon class="margin-r-3" color="gray">
            {{ item.icon }}
          </CUIcon>
          {{ toTitle(item.name) }}
        </div>
      </router-link>
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
    type: Array as PropType<SidebarLink[]>, // use PropType
    default: () => [], // use a factory function
  })
  private readonly links!: SidebarLink[]

  toTitle = toTitle
}
</script>

<style lang="scss" scoped>
.my-company__sidebar {
  //   height: 100%;
  font-weight: bold;
  //   border-right: 1px solid $gray-border;

  &-item {
    border-radius: 5px;
    &:hover {
      color: $gray-light;
      transition: 0.1 ease-in-out all;
    }
  }
}
</style>
