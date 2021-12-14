<template>
  <v-main>
    <router-view />
  </v-main>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class PreAuth extends Vue {}
</script>
