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
      px-2
    "
  >
    <v-toolbar-title class="mr-11">
      <a @click="$router.push({ name: 'home' })" role="link">
        <CharterUPLogo style="width: 108px" />
      </a>
    </v-toolbar-title>
    <router-link
      v-for="(item, index) in topNavigationItems"
      :id="`toolbar-button-${item.label}`"
      :key="`item-link-${index}`"
      :to="{ name: item.link }"
      class="app-bar-link py-0 px-6 font-size-14 font-medium"
      :class="{
        'h-68': $vuetify.breakpoint.smAndUp,
        'h-60': $vuetify.breakpoint.xsOnly,
      }"
    >
      <!-- Double spans allow for precise underlining -->
      <span
        class="
          border-b-2 border-t-0 border-x-0 border-transparent border-solid
          h-full
          d-flex
          align-center
          hover:test-b
        "
      >
        <span class="text-black">{{ item.label }}</span>
      </span>
    </router-link>
  </v-app-bar>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import CharterUPLogo from '@/components/CharterUPLogo.vue'
import { navigation } from '@/data/navigation'
import { NavigationLink } from '@/models/NavigationLink'

@Component({
  components: {
    CharterUPLogo,
  },
})
export default class TheAppBar extends Vue {
  get topNavigationItems(): Array<NavigationLink> {
    return navigation.filter((item) => item.location === 'top')
  }
}
</script>

<style lang="scss" scoped>
@import '@/scss/colors.scss';
// a {
//   &.app-bar-link {
//     &:hover,
//     &.active {
//       > span {
//         border-bottom: 2px solid $black;
//       }
//     }
//   }
// }
</style>
