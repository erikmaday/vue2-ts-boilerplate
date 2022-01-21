<template>
  <v-row>
    <v-col cols="12">
      <div
        class="h-192 border-1 border-solid background-transparent border-gray-border border-radius-regular padding-a-3 text-center d-flex justify-center align-center flex-wrap"
      >
        <v-row>
          <v-col cols="12" class="padding-b-0">
            <CUIcon
              height="32px"
              width="32px"
              :color="dark ? 'white' : 'black'"
            >
              {{ icon }}
            </CUIcon>
          </v-col>
          <v-col cols="12" class="padding-t-0">
            <p :class="{ 'text-white': dark, 'text-black': !dark }">{{ message }}</p>
          </v-col>
        </v-row>
      </div>
    </v-col>
  </v-row>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class TodayNotFound extends Vue {
  @Prop({ required: true, type: String }) readonly icon!: string
  @Prop({ required: true, type: String }) readonly message!: string
  @Prop({ required: false, type: Boolean, default: false }) readonly dark!: boolean
}
</script>
