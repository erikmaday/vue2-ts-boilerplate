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
        <CUIcon large class="text-black cursor-pointer" @click="sidebar.close">
          close
        </CUIcon>
      </v-row>
      <v-row>
        <template v-for="(item, itemIndex) in navigationItems">
          <v-col
            v-if="!item.children"
            cols="12"
            :id="`side-bar-navigation-button-${item.label}`"
            :key="`item-link-${itemIndex}`"
            class="padding-x-0 padding-y-2 font-medium font-18"
          >
            <span class="cursor-pointer" @click="handleNavigationClick(item)">
              {{ item.label }}
            </span>
          </v-col>
          <template v-else>
            <v-col
              v-for="(childItem, childItemIndex) in item.children"
              cols="12"
              :id="`side-bar-navigation-button-${item.label}-${childItem.label}`"
              :key="`item-link-${itemIndex}-child-item-${childItemIndex}`"
              class="padding-x-0 padding-y-2 font-medium font-18"
            >
              <span
                class="cursor-pointer"
                @click="handleNavigationClick(childItem)"
              >
                {{ childItem.label }}
              </span>
            </v-col>
          </template>
        </template>

        <v-col cols="12" class="padding-x-0 padding-y-2 font-medium font-14">
          {{ userName }}
        </v-col>
      </v-row>
    </v-container>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import CharterUPLogo from '@/components/CharterUPLogo.vue'
import { navigation } from '@/data/navigation'
import { NavigationLink } from '@/models/NavigationLink'
import modules from '@/store/modules'
import auth from '@/store/modules/auth'

@Component({
  components: {
    CharterUPLogo,
  },
})
export default class TheSideBar extends Vue {
  showSidebar = false
  sidebar = modules.sidebar

  get navigationItems(): NavigationLink[] {
    return navigation
  }
  get isSidebarOpen(): boolean {
    return this.sidebar.isOpen
  }

  get userName(): string {
    return `${auth.getUser?.firstName} ${auth.getUser?.lastName}`
  }

  @Watch('isSidebarOpen')
  isSidebarOpenChanged(value: boolean): void {
    if (value !== this.showSidebar) {
      this.showSidebar = value
    }
  }

  @Watch('showSidebar')
  showSidebarChanged(value: boolean): void {
    if (value !== this.sidebar.isOpen) {
      if (value) {
        this.sidebar.open()
      } else {
        this.sidebar.close()
      }
    }
  }

  handleNavigationClick(item: NavigationLink): void {
    if (item.name) {
      this.$router.push({ name: item.name })
    } else if (item.action) {
      item.action()
    }
  }
}
</script>
