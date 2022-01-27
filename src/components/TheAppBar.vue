<template>
  <v-app-bar
    app
    :height="$vuetify.breakpoint.smAndUp ? 68 : 60"
    flat
    class="font-medium z-20 border-b border-solid border-gray-border border-x-0 border-t-0 background-white padding-x-2"
  >
    <v-toolbar-title class="margin-r-4">
      <router-link :to="{ name: 'home' }">
        <CharterUPLogo style="width: 108px" />
      </router-link>
    </v-toolbar-title>
    <template v-if="showAppBarNavigation">
      <template v-if="$vuetify.breakpoint.mdAndUp">
        <div
          v-for="(item, index) in topNavigationItems"
          :id="`app-bar-button-${item.label}`"
          :key="`item-link-${index}`"
          @click="handleNavigationClick(item)"
          class="cursor-pointer padding-y-0 padding-x-4 first-of-type:padding-l-0 font-14 font-medium text-black text-no-wrap"
          :class="{
            'h-68': $vuetify.breakpoint.smAndUp,
            'h-60': $vuetify.breakpoint.xsOnly,
          }"
        >
          <v-menu v-if="item.children" bottom offset-y nudge-top="15px">
            <template v-slot:activator="{ on }">
              <span
                class="h-full d-flex align-center"
                style="margin-top: -1px"
                v-on="on"
              >
                {{ item.label }}
                <CUIcon
                  class="margin-r-3"
                  width="20px"
                  height="20px"
                  color="black"
                >
                  keyboard_arrow_down
                </CUIcon>
              </span>
            </template>
            <v-list>
              <v-list-item
                v-for="(childLink, cIndex) in item.children"
                :key="`child-${cIndex}`"
                @click="handleNavigationClick(childLink)"
                class="font-14 font-medium"
              >
                <CUIcon
                  class="margin-r-3"
                  width="20px"
                  height="20px"
                  color="black"
                >
                  {{ childLink.icon }}
                </CUIcon>
                {{ childLink.label }}
              </v-list-item>
            </v-list>
          </v-menu>
          <!-- Double spans allow for precise underlining -->
          <span
            v-else
            class="h-full d-flex align-center border-b-2 border-t-0 border-x-0 border-solid hover:border-black active:border-black"
            :class="{
              'border-black': isRouteActive(item),
              'border-transparent': !isRouteActive(item),
            }"
          >
            <span>{{ item.label }}</span>
          </span>
        </div>
      </template>
      <v-spacer />

      <!-- ADD BACK IN LATER WHEN WE SUPPORT GLOBAL SEARCH AND NOTIFICATIONS
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
      </v-badge> -->

      <template v-if="$vuetify.breakpoint.mdAndUp">
        <v-btn
          href="mailto:support@charterup.com"
          small
          text
          color="primary"
          class="margin-r-2"
        >
          Support
        </v-btn>
        <v-menu class="border-0">
          <template #activator="{ on }">
            <div
              id="app-bar-button-drop-down"
              class="d-flex align-center cursor-pointer"
              v-on="on"
            >
              <span class="font-14 font-medium text-no-wrap">
                {{ userName }}
              </span>
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
        <CUIcon
          class="text-black cursor-pointer margin-l-3"
          :key="`menu-icon`"
          @click="openSidebar"
        >
          menu_three_lines
        </CUIcon>
      </template>
    </template>
    <template v-else-if="auth.getIsDriverOnly">
      <v-spacer />
      <v-btn text small color="primary" @click="auth.logout">Logout</v-btn>
    </template>
  </v-app-bar>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import CharterUPLogo from '@/components/CharterUPLogo.vue'
import { navigation } from '@/data/navigation'
import { NavigationLink } from '@/models/NavigationLink'
import modules from '@/store/modules'
import auth from '@/store/modules/auth'
import { RawLocation } from 'vue-router'

@Component({
  components: {
    CharterUPLogo,
  },
})
export default class TheAppBar extends Vue {
  auth = auth

  get topNavigationItems(): NavigationLink[] {
    return navigation.filter((item) => item.location === 'top')
  }

  get dropdownNavigationItems(): NavigationLink[] {
    return navigation.filter((item) => item.location === 'dropdown')
  }

  get userName(): string {
    return auth.getFullName
  }

  get isRoutePreauth(): boolean {
    return ['login', 'set-password'].includes(this.$route.name)
  }

  get showAppBarNavigation(): boolean {
    return !this.isRoutePreauth && auth.getIsTokenSet && !auth.getIsDriverOnly
  }

  openSidebar(): void {
    modules.sidebar.open()
  }

  handleNavigationClick(item: NavigationLink): void {
    if (item.name) {
      this.$router.push({ name: item.name })
    } else if (item.action) {
      item.action()
    }
  }

  isRouteActive(item: NavigationLink): boolean {
    const rawLocation: RawLocation = { name: item.name }
    const route = this.$router.resolve(rawLocation)
    let path = route.href
    if (path[path.length - 1] === '/') {
      path = path.slice(0, -1)
    }
    const matchedRoute = this.$route.matched.find(
      (route) => route.path === path
    )
    return !!matchedRoute
  }
}
</script>
