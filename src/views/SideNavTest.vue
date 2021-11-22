<template>
  <MainWithNavigation></MainWithNavigation>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import MainWithNavigation from '@/layouts/MainWithNavigation.vue'

@Component({
  components: {
    MainWithNavigation,
  },
})
export default class SideNavTest extends Vue {}
</script>
