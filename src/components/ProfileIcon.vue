<template>
  <v-row wrap>
    <v-col v-if="editMode" cols="12">
      <ProfileIconUpload
        :entityType="entityType"
        class="margin-t-3"
        @changePhoto="getPhoto"
      />
    </v-col>
    <v-col cols="12">
      <div
        class="
          w-200
          h-200
          object-fit-cover
          border-radius-round
          overflow-hidden
          border-solid border-4 border-gray-border
        "
      >
        <img
          v-if="photoSource !== ''"
          class="h-full w-full"
          :src="photoSource"
        />
        <div
          v-else
          class="
            d-flex
            align-center
            justify-center
            h-192
            w-192
            background-gray-header
          "
        >
          <CUIcon color="gray-mid-light" width="120px" height="120px">
            person
          </CUIcon>
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import auth from '@/store/modules/auth'
import { baseUrl } from '@/utils/env'
import { Component, Prop, Vue } from 'vue-property-decorator'
import ProfileIconUpload from '@/components/ProfileIconUpload.vue'
import company from '@/services/company'

@Component({ components: { ProfileIconUpload } })
export default class ProfileIcon extends Vue {
  @Prop({ required: true }) readonly editMode!: boolean
  @Prop({ required: true }) readonly entityType!: string

  photoSource = ''

  async getPhoto(): Promise<void> {
    if (this.entityType === 'company') {
      let companyPhotoSrc = await company
        .getCompanyPhoto(auth.getUser.companyId)
        .then((data) => data.data.imagePath)
      this.photoSource = `https://${baseUrl()}${companyPhotoSrc}`
    }
  }
  async mounted(): Promise<void> {
    await this.getPhoto()
  }
}
</script>
