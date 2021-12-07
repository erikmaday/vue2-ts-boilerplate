<template>
  <div class="h-full">
    <TheSideBar />
    <TheAppBar />
    <v-main>
      <router-view />
    </v-main>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import TheAppBar from '@/components/TheAppBar.vue'
import TheSideBar from '@/components/TheSideBar.vue'
import modules from '@/store/modules'

@Component({
  components: {
    TheAppBar,
    TheSideBar,
  },
})
export default class Home extends Vue {
  @Watch('$vuetify.breakpoint.mdAndUp')
  shouldHideSidebar(value: boolean): void {
    if (value) {
      modules.sidebar.close()
    }
  }
}
</script>
