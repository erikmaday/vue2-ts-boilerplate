<template>
  <v-app>
    <TheSideBar v-model="isSidebarOpen" />
    <TheAppBar @open-sidebar="isSidebarOpen = true" />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import TheAppBar from '@/components/TheAppBar.vue'
import TheSideBar from '@/components/TheSideBar.vue'

@Component({
  components: {
    TheAppBar,
    TheSideBar,
  },
})
export default class Home extends Vue {
  isSidebarOpen = false
}
</script>
