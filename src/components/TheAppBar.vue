<template>
  <v-app-bar
    app
    :height="$vuetify.breakpoint.smAndUp ? 68 : 60"
    flat
    class="
      font-medium
      z-20
      border-b border-solid border-gray-border border-x-0 border-t-0
      background-white
      padding-x-2
    "
  >
    <v-toolbar-title class="margin-r-4">
      <a @click="$router.push({ name: 'home' })" role="link">
        <CharterUPLogo style="width: 108px" />
      </a>
    </v-toolbar-title>
    <template v-if="$vuetify.breakpoint.mdAndUp">
      <div
        v-for="(item, index) in topNavigationItems"
        :id="`app-bar-button-${item.label}`"
        :key="`item-link-${index}`"
        @click="handleNavigationClick(item)"
        class="
          cursor-pointer
          padding-y-0 padding-x-4
          first-of-type:padding-l-0
          font-14 font-medium
          text-black text-no-wrap
        "
        :class="{
          'h-68': $vuetify.breakpoint.smAndUp,
          'h-60': $vuetify.breakpoint.xsOnly,
        }"
      >
        <!-- Double spans allow for precise underlining -->
        <span
          class="
            h-full
            d-flex
            align-center
            border-b-2 border-t-0 border-x-0 border-transparent border-solid
            hover:border-black
            active:border-black
          "
          :class="{ 'border-black': item.link === $route.name }"
        >
          <span>{{ item.label }}</span>
        </span>
      </div>
      <v-spacer />
      <CUIcon class="text-gray-mid-light margin-r-4" large :key="`search-icon`">
        search
      </CUIcon>

      <v-badge bordered color="error" :content="0" :value="0" overlap>
        <CUIcon
          class="text-gray-mid-light margin-r-2"
          large
          :key="`notification-icon`"
        >
          notifications
        </CUIcon>
      </v-badge>
      <v-btn small text color="primary" class="margin-r-2">Support</v-btn>
      <v-menu class="border-0">
        <template #activator="{ on }">
          <div
            id="app-bar-button-drop-down"
            class="d-flex align-center cursor-pointer"
            v-on="on"
          >
            <span class="font-14 font-medium text-no-wrap">First Last</span>
            <CUIcon class="text-black">keyboard_arrow_down</CUIcon>
          </div>
        </template>
        <v-list class="font-14 font-medium">
          <v-list-item
            v-for="(item, index) in dropdownNavigationItems"
            :id="`app-bar-dropdown-button-${item.label}`"
            :key="`dropdown-item-link-${index}`"
            @click="handleNavigationClick(item)"
          >
            {{ item.label }}
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
    <template v-else>
      <v-spacer />
      <CUIcon
        class="text-black cursor-pointer"
        :key="`menu-icon`"
        @click="openSidebar"
      >
        menu_three_lines
      </CUIcon>
    </template>
  </v-app-bar>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
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
export default class TheAppBar extends Vue {
  get topNavigationItems(): NavigationLink[] {
    return navigation.filter((item) => item.location === 'top')
  }

  get dropdownNavigationItems(): NavigationLink[] {
    return navigation.filter((item) => item.location === 'dropdown')
  }

  openSidebar(): void {
    modules.sidebar.open()
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
