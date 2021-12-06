<template>
  <div>
    <TheSideBar />
    <TheAppBar />
    <v-main>
      <AutocompleteAddress v-model="address" />
      <router-view />
    </v-main>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import TheAppBar from '@/components/TheAppBar.vue'
import TheSideBar from '@/components/TheSideBar.vue'
import AutocompleteAddress from '@/components/AutocompleteAddress.vue'
import { Address } from '@/models/dtos'
import modules from '@/store/modules'

@Component({
  components: {
    TheAppBar,
    TheSideBar,
    AutocompleteAddress,
  },
})
export default class Home extends Vue {
  address: Address | null = null
  @Watch('$vuetify.breakpoint.mdAndUp')
  shouldHideSidebar(value: boolean): void {
    if (value) {
      modules.sidebar.close()
    }
  }
}
</script>
