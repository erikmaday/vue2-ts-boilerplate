<template>
  <div>
    <h1>Accounts Integration</h1>
    <template v-for="[key, val] in Object.entries(credentialMap)">    
      <CompanyIntegrationBlock
        :key="`integration-block-${key}`"
        class="margin-y-4"
        v-bind="val"
        :typeId="key"
        @input="val.accessToken = $event"
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
  

  async mounted() {
    const res = await credentials.getAll()
    this.credentials = res.data.eldCredentials
  }

  get credentialMap(): any {

    const emptyBlock = {
      accessToken: '',
    }

    // def a cleaner way to do this
    const map = { 2: deepClone(emptyBlock), 3: deepClone(emptyBlock) }

    for (const key in map) {
      const matchingCredential = this.credentials.find(
        (c) => c.eldCredentialTypeId === Number(key)
      )
      if (matchingCredential) {
        map[key] = deepClone(matchingCredential)
      }
    }
    return map
  }

}
</script>
