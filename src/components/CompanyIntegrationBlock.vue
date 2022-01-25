<template>
  <v-card
    class="d-flex w-full border-solid border-gray-border cursor-pointer border-1 border-radius-normal"
    :class="{
      'h-72 align-center justify-space-between w-full padding-r-8':
        $vuetify.breakpoint.smAndUp,
      'flex-column max-w-300 padding-t-12 padding-b-6 align-center justify-space-around':
        $vuetify.breakpoint.xs,
    }"
    @click="isDialogOpen = true"
  >
    <img
      v-if="$vuetify.breakpoint.smAndUp"
      class="max-h-20 margin-l-6"
      :src="logo"
    />
    <img
      v-else
      class="h-120 w-three-fifths object-fit-contain margin-b-3"
      :src="mobileLogo"
    />
    <template v-if="credentialIsExisting">
      <CUIcon width="24px" height="24px" color="primary">check_circle</CUIcon>
    </template>
    <template v-else>
      <div class="d-flex align-center">
        <span class="text-primary margin-r-2 font-bold font-16">Sync</span>
        <CUIcon width="20px" height="20px" color="primary">arrow_right</CUIcon>
      </div>
    </template>
    <CompanyIntegrationModal v-model="isDialogOpen" v-bind="$props" @refresh="$emit('refresh')" />
  </v-card>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { eldInformation } from '@/utils/integrations'
import CompanyIntegrationModal from '@/components/CompanyIntegrationModal.vue'
@Component({
  components: { CompanyIntegrationModal },
})
export default class CompanyIntegrationBlock extends Vue {
  @Prop({
    required: true,
  })
  eldCredentialTypeId!: number

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

  get credentialIsExisting(): boolean {
    return this.eldCredentialsId != null
  }

  get logo(): string {
    return this.eldInformation[this.eldCredentialTypeId].logo
  }

  get mobileLogo(): string {
    return this.eldInformation[this.eldCredentialTypeId].mobileLogo
  }
}
</script>
