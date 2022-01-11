<template>
  <Guest>
    <v-main>
      <v-container
        class="max-w-760"
        :class="{ 'padding-x-8': $vuetify.breakpoint.xsOnly }"
      >
        <v-row :class="{ 'margin-t-8': $vuetify.breakpoint.smAndUp }">
          <v-col cols="12" sm="6">
            <v-row>
              <v-col cols="12">
                <h2 class="font-weight-400 font-medium">
                  Please download the
                  <CharterUPLogo
                    style="width: 130px; margin-bottom: -1px; margin-left: 2px"
                  />
                  Drivers App
                </h2>
              </v-col>
              <v-col cols="12">
                <p class="font-14" style="line-height: 2.25em">
                  Thank you for using CharterUP. Your account is setup to use
                  our mobile app, called CharterUP Drivers. This app will allow
                  you to see and complete your assigned trips
                </p>
              </v-col>
              <v-col cols="6">
                <img
                  class="w-full max-w-full"
                  src="@/assets/images/app-store.png"
                />
              </v-col>
              <v-col cols="6">
                <img
                  class="w-full max-w-full"
                  src="@/assets/images/google-play.png"
                />
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" sm="6" v-show="$vuetify.breakpoint.smAndUp">
            <img class="w-full max-w-full" src="@/assets/images/phone.png" />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </Guest>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import CharterUPLogo from '@/components/CharterUPLogo.vue'
import modules from '@/store/modules'
import Guest from '@/layouts/Guest.vue'

@Component({
  components: {
    CharterUPLogo,
    Guest,
  },
})
export default class DownloadApp extends Vue {
  async logout(): Promise<void> {
    modules.auth.logout()
  }
}
</script>
