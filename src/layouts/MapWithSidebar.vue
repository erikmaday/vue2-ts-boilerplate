<template>
  <v-container fluid class="padding-a-0 fill-height">
    <v-row no-gutters class="fill-height">
      <v-col
        v-if="showPanel"
        cols="12"
        :class="{
          'max-w-404': $vuetify.breakpoint.smAndUp,
          'w-404': $vuetify.breakpoint.smAndUp,
          'shadow-right': $vuetify.breakpoint.smAndUp,
        }"
        class="padding-a-6 z-3"
      >
        <slot name="sidebar-content" />
      </v-col>
      <v-col v-if="showMap" sm="auto" cols="12" class="flex-grow-1 z-2">
        <slot name="map-content" />
      </v-col>
    </v-row>
    <v-row
      v-if="$vuetify.breakpoint.xsOnly"
      class="margin-x-0 margin-t-n8 padding-y-1 margin-b-0 justify-center z-4"
    >
      <CUIcon
        class="text-black"
        :class="{ 'opacity-25': !showPanel }"
        @click="mobileShowMap = false"
      >
        dot
      </CUIcon>
      <CUIcon
        class="text-black"
        :class="{ 'opacity-25': !showMap }"
        @click="mobileShowMap = true"
      >
        dot
      </CUIcon>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import CUIcon from '@/components/CUIcon.vue'

@Component({
  components: {
    CUIcon,
  },
})
export default class MapWithSidebar extends Vue {
  mobileShowMap = false

  get showPanel(): boolean {
    return this.$vuetify.breakpoint.smAndUp || !this.mobileShowMap
  }

  get showMap(): boolean {
    return this.$vuetify.breakpoint.smAndUp || this.mobileShowMap
  }
}
</script>

<style lang="scss" scoped>
.shadow-right {
  box-shadow: 0px 0px 35px 0px rgba($black-true, 0.35);
}
</style>
