<template>
  <Main>
    <v-row class="align-center justify-center">
      <v-col
        v-show="!!$slots.back"
        :class="{
          'col-12 text-center padding-y-0': $vuetify.breakpoint.xs,
          'col-auto padding-r-0': $vuetify.breakpoint.smAndUp,
        }"
      >
        <slot name="back" />
      </v-col>
      <v-col
        :class="{
          'col-12 text-center padding-t-2 padding-b-0': $vuetify.breakpoint.xs,
          'col-auto': $vuetify.breakpoint.smAndUp,
          'padding-l-0': $vuetify.breakpoint.sm,
        }"
      >
        <h1 class="margin-b-0"><slot name="title" /></h1>
      </v-col>
      <v-spacer v-if="$vuetify.breakpoint.mdAndUp" />
      <div
        class="d-flex shrink padding-a-3"
        :class="{
          'flex-row': $vuetify.breakpoint.smAndUp,
          'justify-center w-full': $vuetify.breakpoint.sm,
          'flex-column flex-column-reverse col-12': $vuetify.breakpoint.xs,
          'justify-end': $vuetify.breakpoint.mdAndUp,
        }"
      >
        <slot name="buttons" />
      </div>
    </v-row>
    <slot />
  </Main>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Main from '@/layouts/Main.vue'

@Component({ components: { Main } })
export default class Detail extends Vue {}
</script>
