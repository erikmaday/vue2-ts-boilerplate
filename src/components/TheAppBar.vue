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
  </v-app-bar>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import CharterUPLogo from '@/components/CharterUPLogo.vue'

@Component({
  components: {
    CharterUPLogo,
  },
})
export default class TheAppBar extends Vue {}
</script>

<style lang="scss" scoped>
@import '~@/scss/colors';
</style>
