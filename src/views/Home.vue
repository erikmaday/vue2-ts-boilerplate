<template>
  <v-app>
    <TheAppBar />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import TheAppBar from '@/components/TheAppBar.vue'

@Component({
  components: {
    TheAppBar,
  },
})
export default class Home extends Vue {}
</script>
