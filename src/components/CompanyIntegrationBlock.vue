<template>
  <v-card
    class="h-72 d-flex align-center justify-space-between w-full border-solid border-gray-border cursor-pointer border-1 border-radius-5 padding-r-8"
    @click="isDialogOpen = true"
  >
    <img class="max-h-20 margin-l-6 margin-r-40" :src="logo" />
    <template v-if="eldCredentialsId">
      <CUIcon width="24px" height="24px" color="primary">check_circle</CUIcon>
    </template>
    <template v-else>
      <div class="d-flex align-center">
        <span class="text-primary margin-r-2 font-bold font-16">Sync</span>
        <CUIcon width="20px" height="20px" color="primary">arrow_right</CUIcon>
      </div>
    </template>
    <!-- <v-btn
      v-if="!eldCredentialsId"
      class="margin-r-4"
      text
      small
      color="primary"
      @click="isDialogOpen = true"
    >
      Sync
      <CUIcon width="20px" height="20px" color="primary">arrow_right</CUIcon>
    </v-btn>
    <v-btn
      v-else
      class="margin-r-6"
      icon
      small
      color="primary"
      @click="isDialogOpen = true"
    >
      <CUIcon width="24px" height="24px" color="primary">check_circle</CUIcon>
    </v-btn> -->
    <CUModal v-model="isDialogOpen">
      <template #title>Sync from {{ label }}</template>
      <template #text>
        <p class="margin-b-4">
          Where do I find this?
          <a :href="eldInformation[typeId].supportUrl" target="_blank">
            Click here to learn more
          </a>
        </p>
        <CUTextField
          dense
          :value="accessToken"
          :label="eldInformation[typeId].accessTokenLabel"
          @input="$emit('input', $event)"
        />
      </template>
      <template #actions>
        <v-spacer />
        <v-btn text small color="primary" @click="isDialogOpen = false">Cancel</v-btn>
        <v-btn small color="primary" @click="submit">Continue</v-btn>
      </template>
    </CUModal>
  </v-card>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { eldInformation } from '@/utils/integrations'
import credentials from '@/services/credentials'
import { EldCredential } from '@/models/EldCredential'

@Component({})
export default class CompanyIntegrationBlock extends Vue {
  @Prop({
    required: true,
  })
  typeId!: number

  @Prop({
    required: false,
  })
  eldCredentialsId: number

  @Prop({
    required: false,
    default: '',
  })
  accessToken: string

  isDialogOpen = false
  eldInformation = eldInformation
  
  get logo() {
    return eldInformation[this.typeId].logo
  }

  get label(): string {
    return eldInformation[this.typeId].label
  }

  async submit(): Promise<void> {
    this.isDialogOpen = false
  }
}
</script>
