<template>
  <v-row align="stretch" justify="center" class="margin-b-11" no-gutters>
    <v-col cols="10" sm="7" class="text-center">
      <v-img :src="img" class="margin-t-6 margin-b-3" />
      <div
        :class="{
          'font-40': $vuetify.breakpoint.smAndUp,
          'font-30': $vuetify.breakpoint.xs,
        }"
      >
        <slot name="header">Oops! We took a wrong turn.</slot>
      </div>
      <v-col class="pb-5 pt-2">
        <slot name="content">
          This page does not exist or some other error has occurred.
          <br />
          Please check your url or return to the
          <router-link :to="{ href: '/' }">home page</router-link>
          .
        </slot>
      </v-col>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class NotFoundLayout extends Vue {
  @Prop({ default: require('@/assets/images/404.png') })
  img!: string
}
</script>
