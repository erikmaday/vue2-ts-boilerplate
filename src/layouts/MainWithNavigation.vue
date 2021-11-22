<template>
  <v-container
    fluid
    class="pa-0"
    :class="{ 'fill-height': $vuetify.breakpoint.mdAndUp }"
  >
    <v-row no-gutters :class="{ 'fill-height': $vuetify.breakpoint.mdAndUp }">
      <v-col
        v-if="$vuetify.breakpoint.mdAndUp"
        :key="`side-navigation`"
        :style="{
          width: `${sidebarWidth}px`,
          'max-width': `${sidebarWidth}px`,
        }"
        class="
          background-gray-header
          border-y-0 border-l-0 border-r border-gray-border border-solid
        "
      >
        <slot name="navigation" />
      </v-col>
      <v-col v-else cols="12">
        <h1><slot name="section-title" /></h1>
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              :id="`sidebar-menu-mobile`"
              class="kebab-button mt-n2"
              v-bind="attrs"
              v-on="on"
            >
              more_vert
            </v-icon>
          </template>
          <slot name="navigation" />
        </v-menu>
      </v-col>
      <v-col>
        <slot />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Prop, Vue, Component } from 'vue-property-decorator'

@Component
export default class MainWithNavigation extends Vue {
  @Prop({ default: 400 })
  sidebarWidth!: number
}
</script>
