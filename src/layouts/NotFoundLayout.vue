<template>
  <v-row align="stretch" justify="center" class="margin-bottom-11" no-gutters>
    <v-col cols="7" class="text-center">
      <v-img :src="img" class="margin-top-6 margin-bottom-3" />
      <div class="font-40">
        <slot name="header" />
        <span v-if="!$slots.header">Oops! We took a wrong turn.</span>
      </div>
      <v-col class="pb-5 pt-2">
        <slot name="content" />
        <span v-if="!$slots.content">
          This page does not exist or some other error has occurred.
          <br />
          Please check your url or return to the
          <router-link :to="{ href: '/' }">home page</router-link>
          .
        </span>
      </v-col>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Vue, Component, Prop} from 'vue-property-decorator'

@Component
export default class NotFoundLayout extends Vue {
  @Prop({ default: require('@/assets/images/404.png') })
  img!: string
}
</script>
