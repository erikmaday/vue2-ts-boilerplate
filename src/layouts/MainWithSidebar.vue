<template>
  <v-container
    fluid
    class="padding-a-0"
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
        class="padding-a-6 border-y-0 border-l-0 border-r border-gray-border border-solid"
        :class="`background-${sidebarColor}`"
      >
        <slot name="navigation" />
      </v-col>
      <v-col class="padding-a-6" :class="`background-${mainColor}`">
        <v-container
          :style="{ 'max-width': `${$vuetify.breakpoint.thresholds.md}px` }"
        >
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
                    <CUIcon class="text-black" v-on="on" v-bind="attrs">
                      more_vert
                    </CUIcon>
                  </template>
                  <slot name="navigation" />
                </v-menu>
              </div>
            </template>
          </v-row>
          <v-container>
            <v-row justify="center">
              <slot />
            </v-row>
          </v-container>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Prop, Vue, Component } from 'vue-property-decorator'

@Component
export default class MainWithSidebar extends Vue {
  @Prop({ default: 278 })
  sidebarWidth!: number

  @Prop({ default: 'gray-header' })
  sidebarColor!: string

  @Prop({ default: 'white' })
  mainColor!: string
}
</script>
