<template>
  <v-row>
    <v-col cols="12">
      <div
        class="h-192 border-1 border-solid background-transparent border-radius-regular padding-a-3 text-center d-flex justify-center align-center flex-wrap"
        :class="{ 'border-black': dark, 'border-gray-border': !dark }"
      >
        <v-row>
          <v-col cols="12" class="padding-b-0">
            <CUIcon height="32px" width="32px" color="gray-light">
              {{ icon }}
            </CUIcon>
          </v-col>
          <v-col cols="12" class="padding-t-0">
            <p class="text-gray-light">{{ message }}</p>
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
  @Prop({ required: false, type: Boolean, default: false })
  readonly dark!: boolean
}
</script>
