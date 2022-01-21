<template>
  <div
    class="w-full max-w-500"
    :class="{
      'text-center d-flex flex-column align-center': $vuetify.breakpoint.xs,
    }"
  >
    <h1>Accounts Integration</h1>
    <template v-for="[key, val] in Object.entries(credentialsMap)">
      <CompanyIntegrationBlock
        :key="`integration-block-${key}`"
        class="margin-y-4"
        v-bind="val"
        :eld-credential-type-id="key"
        @refresh="initializeCredentials"
      />
    </template>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import CompanyIntegrationBlock from '@/components/CompanyIntegrationBlock.vue'
import { EldCredential } from '@/models/EldCredential'
import credentials from '@/services/credentials'
import deepClone from '@/utils/deepClone'

@Component({ components: { CompanyIntegrationBlock } })
export default class CompanyIntegration extends Vue {
  credentials: EldCredential[] = []
  credentialsMap = { 2: { accessToken: '' }, 3: { accessToken: '' } }

  async mounted(): Promise<void> {
    this.initializeCredentials()
  }

  async initializeCredentials(): Promise<void> {
    const res = await credentials.getAll()
    this.credentials = res.data.eldCredentials

    for (const key in this.credentialsMap) {
      const matchingCredential = this.credentials.find(
        (c) => c.eldCredentialTypeId === Number(key)
      )
      if (matchingCredential) {
        this.credentialsMap[key] = deepClone(matchingCredential)
      }
    }
  }
}
</script>
