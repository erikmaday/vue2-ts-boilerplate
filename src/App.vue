<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { AxiosResponse } from 'axios'
import Vue from 'vue'
import { AddressApiResult, Address, Stop } from './models/dto'
import { HttpService } from './services/HttpService'

export default Vue.extend({
  name: 'App',

  data: () => ({
    //
  }),
  async mounted() {
    const httpService: HttpService = new HttpService()
    const a = {} as unknown as Address
    const fakeStop = { orderIndex: 1, active: true, address: a }
    const response: AxiosResponse<AddressApiResult> = await httpService
      .post<AddressApiResult, Stop>('http://something', fakeStop)
      .catch((f) => f.data)
    if (!response?.data?.successful) {
      console.log(response?.data || 'nothing to see here')
    }
  },
})
</script>
