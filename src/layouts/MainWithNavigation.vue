<template>
  <v-container
    fluid
    class="pa-0"
    :class="{ 'fill-height': $vuetify.breakpoint.mdAndUp }"
  >
    <v-row no-gutters :class="{ 'fill-height': $vuetify.breakpoint.mdAndUp }">
      <v-col
        v-if="$vuetify.breakpoint.mdAndUp"
        key="side-navigation"
        :style="{
          width: `${sidebarWidth}px`,
          'max-width': `${sidebarWidth}px`,
        }"
        class="
          pa-6
          background-gray-header
          border-y-0 border-l-0 border-r border-gray-border border-solid
        "
      >
        <slot name="navigation" />
      </v-col>
      <v-col class="pa-6">
        <v-row align="center">
          <v-col cols="auto">
            <h1><slot name="section-title" /></h1>
          </v-col>
          <v-col cols="auto">
            <slot name="top-bar-content" />
          </v-col>
          <template v-if="$vuetify.breakpoint.smAndDown">
            <v-spacer />
            <div class="shrink">
              <v-menu offset-y>
                <template #activator="{ on, attrs }">
                  <!-- TODO: Switch this back to CUIcon as soon
                  as we figure out issue with v-menu
                  <CUIcon class="text-black" v-on="on" v-bind="attrs">
                    more_vert
                  </CUIcon> -->
                  <v-icon color="black" v-on="on" v-bind="attrs">
                    mdi-dots-vertical
                  </v-icon>
                </template>
                <slot name="navigation" />
              </v-menu>
            </div>
          </template>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Prop, Vue, Component } from 'vue-property-decorator'
import CUIcon from '@/components/CUIcon.vue'

@Component({
  components: {
    CUIcon,
  },
})
export default class MainWithNavigation extends Vue {
  @Prop({ default: 400 })
  sidebarWidth!: number
}
</script>
