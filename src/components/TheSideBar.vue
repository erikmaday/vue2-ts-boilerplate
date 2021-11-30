<template>
  <v-navigation-drawer
    v-model="shouldShowSidebar"
    app
    right
    width="70vw"
    temporary
    class="padding-y-2 padding-x-4"
  >
    <v-container>
      <v-row>
        <CharterUPLogo style="width: 135px" class="margin-b-4" />
        <v-spacer />
        <CUIcon large class="text-black">close</CUIcon>
      </v-row>
      <v-row>
        <v-col
          v-for="(item, index) in navigationItems"
          cols="12"
          :id="`side-bar-navigation-button-${item.label}`"
          :key="`item-link-${index}`"
          class="padding-x-0 padding-y-2 font-medium font-18"
          @click="handleNavigationClick(item)"
        >
          <span class="cursor-pointer">{{ item.label }}</span>
        </v-col>
        <v-col cols="12" class="padding-x-0 padding-y-2 font-medium font-14">
          First Last
        </v-col>
      </v-row>
    </v-container>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { Component, Vue, Model, Watch } from 'vue-property-decorator'
import CharterUPLogo from '@/components/CharterUPLogo.vue'
import CUIcon from '@/components/CUIcon.vue'
import { navigation } from '@/data/navigation'
import { NavigationLink } from '@/models/NavigationLink'

@Component({
  components: {
    CharterUPLogo,
    CUIcon,
  },
})
export default class TheSideBar extends Vue {
  @Model('input', { type: Boolean }) readonly isSidebarOpen!: boolean

  shouldShowSidebar = false

  @Watch('isSidebarOpen')
  isSidebarOpenChanged(value: boolean): void {
    if (value !== this.shouldShowSidebar) {
      this.shouldShowSidebar = value
    }
  }

  @Watch('shouldShowSidebar')
  shouldShowSidebarChanged(value: boolean): void {
    if (value !== this.isSidebarOpen) {
      this.$emit('input', this.shouldShowSidebar)
    }
  }

  get navigationItems(): Array<NavigationLink> {
    return navigation
  }

  handleNavigationClick(item: NavigationLink): void {
    if (item.link) {
      this.$router.push(item.link)
    } else if (item.action) {
      item.action()
    }
  }
}
</script>
