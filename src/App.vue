<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import { Address, Stop } from './models/dto'
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
    const response = await httpService
      .post<Address, Stop>('http://something', fakeStop)
      .catch((f) => f.data)
    console.log(response?.data?.street1 || 'nothing to see here')
  },
})
</script>
