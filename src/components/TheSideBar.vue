<template>
  <v-navigation-drawer
    v-model="showSidebar"
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
        <CUIcon
          large
          class="text-black cursor-pointer"
          @click="sidebar.closeSidebar()"
        >
          close
        </CUIcon>
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
import { Component, Vue, Watch } from 'vue-property-decorator'
import CharterUPLogo from '@/components/CharterUPLogo.vue'
import CUIcon from '@/components/CUIcon.vue'
import { navigation } from '@/data/navigation'
import { NavigationLink } from '@/models/NavigationLink'
import modules from '@/store/modules'

@Component({
  components: {
    CharterUPLogo,
    CUIcon,
  },
})
export default class TheSideBar extends Vue {
  showSidebar = false
  sidebar = modules.sidebar

  get navigationItems(): Array<NavigationLink> {
    return navigation
  }
  get isSidebarOpen(): boolean {
    return this.sidebar.isSidebarOpen
  }

  @Watch('isSidebarOpen')
  isSidebarOpenChanged(value: boolean): void {
    if (value !== this.showSidebar) {
      this.showSidebar = value
    }
  }

  @Watch('showSidebar')
  showSidebarChanged(value: boolean): void {
    if (value !== this.sidebar.isSidebarOpen) {
      if (value) {
        this.sidebar.openSidebar()
      } else {
        this.sidebar.closeSidebar()
      }
    }
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
