<template>
  <v-row
    align="stretch"
    justify="center"
    style="margin-bottom: 45px;"
    no-gutters
  >
    <v-col cols="7" style="text-align: center;">
      <v-img :src="img" style="margin-top: 24px; margin-bottom: 12px;" />
      <div class="h0">
        <slot name="header" />
        <span v-if="!$slots.header">Oops! We took a wrong turn.</span>
      </div>
      <v-col class="pb-5 pt-2">
        <slot name="content" />
        <span v-if="!$slots.content">
          This page does not exist or some other error has occurred.
          <br />
          Please check your url or return to the
          <a href="/">home page</a>
          .
        </span>
      </v-col>
    </v-col>
  </v-row>
</template>

<style scoped>
.h0 {
  font-size: 40px;
  font-family: 'Airbnb Cereal App Medium';
}
</style>

<script lang="ts">
import { Vue, Component, Prop} from 'vue-property-decorator'

@Component
export default class NotFoundLayout extends Vue {
  @Prop({ default: require('@/assets/images/404.png') })
  img!: string
}
</script>
