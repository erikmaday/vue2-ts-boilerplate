<template>
  <CUModal :value="value" @input="$emit('input', $event)">
    <template #title>
      Sync from {{ eldInformation[eldCredentialTypeId].label }}
    </template>
    <template #text>
      <v-form ref="token-form">
        <p class="margin-b-4">
          Where do I find this?
          <a :href="eldInformation[eldCredentialTypeId].supportUrl" target="_blank">
            Click here to learn more
          </a>
        </p>
        <div v-if="credentialIsExisting">
          <CUTextField
            type="password"
            dense
            :value="accessToken"
            disabled
            :label="'Current ' + eldInformation[eldCredentialTypeId].accessTokenLabel"
          />
        </div>
        <CUPasswordField
          dense
          v-model="newAccessToken"
          :label="'New ' + eldInformation[eldCredentialTypeId].accessTokenLabel"
          :rules="[(val) => isNotEmptyInput(val) || 'This field is required']"
        />
      </v-form>
    </template>
    <template #actions>
      <v-spacer />
      <v-btn text small color="primary" @click="$emit('input', false)">
        Cancel
      </v-btn>
      <v-btn small color="primary" @click="submit">
        <template v-if="credentialIsExisting">Update</template>
        <template v-else>Add</template>
      </v-btn>
    </template>
  </CUModal>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { eldInformation } from '@/utils/integrations'
import auth from '@/store/modules/auth'
import credentials from '@/services/credentials'
import { isNotEmptyInput } from '@/utils/validators'

@Component({})
export default class CompanyIntegrationModal extends Vue {
  @Prop({
    type: Boolean,
    required: true,
  })
  value!: boolean

  @Prop({
    required: false,
    default: '',
  })
  accessToken: string

  @Prop({
    required: false,
  })
  eldCredentialsId: number

  @Prop({
    required: true,
  })
  eldCredentialTypeId!: number

  eldInformation = eldInformation
  isNotEmptyInput = isNotEmptyInput
  newAccessToken = ''

  get credentialIsExisting(): boolean {
    return this.eldCredentialsId != null
  }

  async submit(): Promise<void> {
    const form: any = this.$refs["token-form"]
    if (!form.validate()) {
      return
    }

    let payload: any = {
      accessToken: this.newAccessToken,
      eldCredentialsType: Number(this.eldCredentialTypeId),
      companyId: auth.getUser.companyId,
    }

    if (this.eldCredentialsId) {
      payload.eldCredentialsId = this.eldCredentialsId
    }

    if (this.credentialIsExisting) {
      await credentials.update(payload)
    } else {
      await credentials.create(payload)
    }

    form.reset()
    this.$emit('input', false)
  }
}
</script>
